using Application.Interfaces;
using Infrastructure.Identity.Models.Roles;
using Infrastructure.Identity.Models.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Identity.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public PermissionService (UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<bool> IsUserGrantedToPermissionAsync(string userNameOrEmail, string permissionName)
        {
            var user = await _userManager.FindByEmailAsync(userNameOrEmail);
            var roles = await _userManager.GetRolesAsync(user);

            if (user == null)
            {
                return false;
            }

            var role = _roleManager.Roles.Where(r => r.Name == roles.FirstOrDefault()).SingleOrDefault();
            var claims = await _roleManager.GetClaimsAsync(role);

            var grantedClaims = claims.Any(c => c.Value == permissionName);

            //var grantedPermissions = user.UserRoles
            //    .Select(ur => ur.Role)
            //    .SelectMany(r => r.)
            //    .Select(rp => rp.Permission);

            return grantedClaims;
        }
    }
}
