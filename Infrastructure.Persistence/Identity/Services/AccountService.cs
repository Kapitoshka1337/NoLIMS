﻿using Application.DTOs.Account;
using Application.Exceptions;
using Application.Interfaces;
using Application.Wrappers;
using Domain.Settings;
using Infrastructure.Identity.Helpers;
using Domain.Entities.User;
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
using Domain.Entities.Role;
using Application.Features.Role.WithPermission;
using MediatR;
using Application.Features.User.Info;
using Microsoft.AspNetCore.Http;

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
        private readonly IUserService _userService;

        public AccountService(UserManager<ApplicationUser> userManager, 
            RoleManager<Role> roleManager, 
            IOptions<JWTSettings> jwtSettings, 
            IDateTimeService dateTimeService, 
            SignInManager<ApplicationUser> signInManager,
            IEmailService emailService,
            IUserService userService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtSettings = jwtSettings.Value;
            _dateTimeService = dateTimeService;
            _signInManager = signInManager;
            this._emailService = emailService;
            _userService = userService;
        }

        public async Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest request, string ipAddress, IMediator mediator)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            var response = new Response<AuthenticationResponse>();

            if (user == null)
            {
                response.Message = $"Пользователя с учетной запиьсю '{request.UserName}' не существует.";
                response.Succeeded = false;
                return response;
            }
            
            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, lockoutOnFailure: false);
            
            if (!result.Succeeded)
            {
                response.Message = $"Не верный логин или пароль.";
                response.Succeeded = false;
                return response;
            }

            JwtSecurityToken jwtSecurityToken = await GenerateJWToken(user);
            response.Data = new AuthenticationResponse();
            response.Data.Id = user.Id;
            response.Data.JWToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            response.Data.UserName = user.UserName;
            
            var query = new QueryInfo() { Id = user.Id.ToString() };
            var roleList = await mediator.Send(new GetRoles());
            var permissionsList = await mediator.Send(query);

            response.Data.Roles = roleList.Data;
            response.Data.Permissions = permissionsList.Data.Permissions;
            response.Data.Claims = permissionsList.Data.Claims;
            
            var refreshToken = GenerateRefreshToken(ipAddress);

            response.Data.RefreshToken = refreshToken.Token;
            response.Succeeded = true;

            return response;
        }

        public async Task<Response<string>> RegisterAsync(RegisterRequest request)
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

            try
            {
                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, Roles.Basic.ToString());
                    return new Response<string>(user.Id.ToString(), message: $"Пользователь с учетной записью '{request.UserName}' успешно зарегистрирован.");
                }
                else
                {
                    throw new ApiException($"{result.Errors.FirstOrDefault()}");
                }

            }
            catch(Exception ex)
            {
                throw new ApiException($"{ex.Message}");
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
            var account = await _userManager.FindByIdAsync(model.UserId.ToString());

            if (account == null) throw new ApiException($"Пользователя с ИД {model.UserId.ToString()} не существует.");

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(account);
            var result = await _userManager.ResetPasswordAsync(account, resetToken, model.Password);
            
            if(result.Succeeded)
            {
                return new Response<string>(model.UserId.ToString(), message: $"Пароль изменен.");
            }
            else
            {
                throw new ApiException($"Ошибка при изменении пароля.");
            }
        }
    }

}
