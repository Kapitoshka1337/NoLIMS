using Application.DTOs.Permission;
using Application.DTOs.User;
using Application.Interfaces;
using Application.Wrappers;
using Infrastructure.Identity.Contexts;
using Infrastructure.Identity.Helpers;
using Infrastructure.Identity.Models;
using Infrastructure.Identity.Models.Permisson;
using Infrastructure.Identity.Models.Roles;
using Infrastructure.Identity.Models.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Identity.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private UserPermissionResponse response = new UserPermissionResponse();
        private readonly IdentityContext _db;

        public UserService(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager, IdentityContext db)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _db = db;
        }

        public async Task<Response<UserPermissionResponse>> GetPermission(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            var moduleClaims = new List<ModuleClaimViewModel>();
            //var allPermissions = new List<RoleClaim>();
            //var policy = typeof(Permissionss);
            //allPermissions.GetPermissions(policy);

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                var roleName = await _roleManager.FindByNameAsync(role);
                // Права роли.
                var claims = await _db.Set<RoleClaim>().Where(c => c.RoleId == roleName.Id).ToListAsync();
                //var claims = await _roleManager.GetClaimsAsync(roleName);
                var groupClaims = claims.GroupBy(c => c.Resource);
                // Значение всех прав.
                //var allClaimValues = allPermissions.Select(a => a.Value).ToList();
                // Значение прав роли.
                //var roleClaimValues = claims.Select(a => a.ClaimValue).ToList();
                // Разрешенные прав
                //var authorizedClaims = allClaimValues.Intersect(roleClaimValues).ToList();
                //var authorizedClaims = allPermissions.Intersect(claims).ToList();

                foreach (var group in groupClaims)
                {
                    var moduleClaim = new ModuleClaimViewModel
                    {
                        Permissions = new Dictionary<string, bool>()
                    };

                    foreach (var item in group)
                    {
                        //var operation = item.ClaimValue.Replace(group.Key + ".", string.Empty);
                        var operation = item.ClaimValue;
                        moduleClaim.Permissions.Add(operation, true);
                    }

                    moduleClaim.Module = group.Key;
                    moduleClaims.Add(moduleClaim);
                }
            }

            response.Id = user.Id;
            response.UserName = user.UserName;
            response.Claims = moduleClaims;

            return new Response<UserPermissionResponse>(response);
        }
    }
}
