using Application.DTOs.Permission;
using Application.DTOs.User;
using Application.Interfaces;
using Application.Wrappers;
using Domain.Entities.Role;
using Domain.Entities.User;
using Infrastructure.Persistence.Contexts;
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
        private readonly ApplicationDbContext _db;

        public UserService(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager, ApplicationDbContext db)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _db = db;
        }

        public async Task<Response<UserPermissionResponse>> GetPermission(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            var moduleClaims = new List<ModuleClaimViewModel>();
            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                var roleName = await _roleManager.FindByNameAsync(role);
                // Права роли.
                var claims = await _db.Set<RoleClaim>().Where(c => c.RoleId == roleName.Id).ToListAsync();
                var groupClaims = claims.GroupBy(c => c.Resource);

                foreach (var group in groupClaims)
                {
                    var moduleClaim = new ModuleClaimViewModel
                    {
                        Permissions = new Dictionary<string, bool>()
                    };

                    if (moduleClaims.Any(m => m.Module == group.Key))
                    {
                        var innerClaim = moduleClaims.Where(m => m.Module == group.Key).First();

                        foreach (var item in group)
                        {
                            if (!innerClaim.Permissions.Any(p =>  p.Key == item.ClaimValue && p.Value == true))
                            {
                                innerClaim.Permissions.Add(item.ClaimValue, true);
                            }
                        }
                    }
                    else
                    {
                        foreach (var item in group)
                        {
                            moduleClaim.Permissions.Add(item.ClaimValue, true);
                        }

                        moduleClaim.Module = group.Key;
                        moduleClaims.Add(moduleClaim);
                    }
                }
            }

            response.Id = user.Id;
            response.UserName = user.UserName;
            response.Claims = moduleClaims;

            return new Response<UserPermissionResponse>(response);
        }
    }
}
