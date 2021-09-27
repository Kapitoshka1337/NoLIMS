using Application.DTOs.Account;
using Application.Exceptions;
using Application.Interfaces;
using Application.Wrappers;
using Domain.Settings;
using Infrastructure.Identity.Helpers;
using Infrastructure.Identity.Models.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Enums;
using System.Threading.Tasks;
using Application.DTOs.Email;
using Infrastructure.Identity.Models.Roles;

namespace Infrastructure.Identity.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly JWTSettings _jwtSettings;
        private readonly IDateTimeService _dateTimeService;
        public AccountService(UserManager<ApplicationUser> userManager, 
            RoleManager<Role> roleManager, 
            IOptions<JWTSettings> jwtSettings, 
            IDateTimeService dateTimeService, 
            SignInManager<ApplicationUser> signInManager,
            IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtSettings = jwtSettings.Value;
            _dateTimeService = dateTimeService;
            _signInManager = signInManager;
            this._emailService = emailService;
        }

        public async Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest request, string ipAddress)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);

            if (user == null)
            {
                throw new ApiException($"Пользователя с учетной запиьсю '{request.UserName}' не существует.");
            }
            
            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, lockoutOnFailure: false);
            
            if (!result.Succeeded)
            {
                throw new ApiException($"Не верный логин или пароль.");
            }
            
            JwtSecurityToken jwtSecurityToken = await GenerateJWToken(user);
            AuthenticationResponse response = new AuthenticationResponse();

            response.Id = user.Id;
            response.JWToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            response.UserName = user.UserName;
            
            var rolesList = await _userManager.GetRolesAsync(user).ConfigureAwait(false);
            
            response.Roles = rolesList.ToList();
            
            var refreshToken = GenerateRefreshToken(ipAddress);
            
            response.RefreshToken = refreshToken.Token;
            
            return new Response<AuthenticationResponse>(response, $"Пользователь с учетной записью '{user.UserName}' авторизован.");
        }

        public async Task<Response<string>> RegisterAsync(RegisterRequest request, string origin)
        {
            var userWithSameUserName = await _userManager.FindByNameAsync(request.UserName);

            if (userWithSameUserName != null)
            {
                throw new ApiException($"Пользователь с учетной записью '{request.UserName}' уже существует.");
            }

            var user = new ApplicationUser
            {
                FirstName = request.FirstName,
                MiddleName = request.MiddleName,
                LastName = request.LastName,
                UserName = request.UserName,
                DepartmentId = request.DepartmentId,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
                
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, Roles.Basic.ToString());

                return new Response<string>(user.Id.ToString(), message: $"Пользователь с учетной записью '{request.UserName}' успешно зарегистрирован.");
            }
            else
            {
                throw new ApiException($"{result.Errors}");
            }
        }

        private async Task<JwtSecurityToken> GenerateJWToken(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var userRoles = roles.Select(r => new Claim(ClaimTypes.Role, r)).ToArray();
            var userClaims = await _userManager.GetClaimsAsync(user).ConfigureAwait(false);
            var roleClaims = new List<Claim>();

            for (int i = 0; i < roles.Count; i++)
            {
                var role = _roleManager.Roles.Where(r => r.Name == roles[i]).SingleOrDefault();
                var claim = await _roleManager.GetClaimsAsync(role);

                foreach (var cl in claim)
                {
                    roleClaims.Add(new Claim(cl.Type, cl.Value));
                }
            }

            string ipAddress = IpHelper.GetIpAddress();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                //new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id.ToString()),
                new Claim("ip", ipAddress),
            }
            .Union(userClaims)
            .Union(roleClaims)
            .Union(userRoles);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
                signingCredentials: creds);

            return token;
        }

        private string RandomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }
        
        //private async Task<string> SendVerificationEmail(ApplicationUser user, string origin)
        //{
        //    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        //    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        //    var route = "api/account/confirm-email/";
        //    var _enpointUri = new Uri(string.Concat($"{origin}/", route));
        //    var verificationUri = QueryHelpers.AddQueryString(_enpointUri.ToString(), "userId", user.Id.ToString());
        //    verificationUri = QueryHelpers.AddQueryString(verificationUri, "code", code);
        //    //Email Service Call Here
        //    return verificationUri;
        //}

        //public async Task<Response<string>> ConfirmEmailAsync(string userId, string code)
        //{
        //    var user = await _userManager.FindByIdAsync(userId);
        //    code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        //    var result = await _userManager.ConfirmEmailAsync(user, code);
        //    if(result.Succeeded)
        //    {
        //        return new Response<string>(user.Id.ToString(), message: $"Account Confirmed for {user.Email}. You can now use the /api/Account/authenticate endpoint.");
        //    }
        //    else
        //    {
        //        throw new ApiException($"An error occured while confirming {user.Email}.");
        //    }
        //}

        private RefreshToken GenerateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = RandomTokenString(),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };
        }

        public async Task ForgotPassword(ForgotPasswordRequest model, string origin)
        {
            var account = await _userManager.FindByNameAsync(model.UserName);

            // always return ok response to prevent email enumeration
            if (account == null) return;

            var code = await _userManager.GeneratePasswordResetTokenAsync(account);
            var route = "api/account/reset-password/";
            var _enpointUri = new Uri(string.Concat($"{origin}/", route));
            var emailRequest = new EmailRequest()
            {
                Body = $"You reset token is - {code}",
                //To = model.Email,
                Subject = "Reset Password",
            };
            await _emailService.SendAsync(emailRequest);
        }

        public async Task<Response<string>> ResetPassword(ResetPasswordRequest model)
        {
            var account = await _userManager.FindByEmailAsync(model.Email);
            if (account == null) throw new ApiException($"No Accounts Registered with {model.Email}.");
            var result = await _userManager.ResetPasswordAsync(account, model.Token, model.Password);
            if(result.Succeeded)
            {
                return new Response<string>(model.Email, message: $"Password Resetted.");
            }
            else
            {
                throw new ApiException($"Error occured while reseting the password.");
            }
        }
    }

}
