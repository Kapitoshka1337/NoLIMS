using Infrastructure.Identity.Models;
using Domain.Entities.User;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Application.Enums;
using Infrastructure.Identity.Models.Permisson;
using Infrastructure.Persistence.Contexts;
using Domain.Entities.Role;

namespace Infrastructure.Identity.Seeds
{
    public static class DefaultRoles
    {
        public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager, ApplicationDbContext db)
        {
            var basicRole = await roleManager.FindByNameAsync(Roles.Basic.ToString());
            var adminRole = await roleManager.FindByNameAsync(Roles.Admin.ToString());

            if (basicRole == null)
            {
                await roleManager.CreateAsync(new Role(Roles.Basic.ToString(), true));
                basicRole = await roleManager.FindByNameAsync(Roles.Basic.ToString());

                var basicClaims = await roleManager.GetClaimsAsync(basicRole);

                if (basicClaims.Count <= 0)
                {
                    RoleClaim loginView = new RoleClaim() { RoleId = basicRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Index.loginView, Resource = Permissionss.Index.Resource };
                    RoleClaim userView = new RoleClaim() { RoleId = basicRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Index.userView, Resource = Permissionss.Index.Resource };
                    RoleClaim indexView = new RoleClaim() { RoleId = basicRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Login.indexView, Resource = Permissionss.Login.Resource };

                    await db.Set<RoleClaim>().AddAsync(loginView);
                    await db.Set<RoleClaim>().AddAsync(userView);
                    await db.Set<RoleClaim>().AddAsync(indexView);
                    await db.SaveChangesAsync();
                }
            }

            if (adminRole == null)
            {
                await roleManager.CreateAsync(new Role(Roles.Admin.ToString(), true));
                adminRole = await roleManager.FindByNameAsync(Roles.Admin.ToString());

                var adminClaims = await roleManager.GetClaimsAsync(adminRole);


                if (adminClaims.Count <= 0)
                {
                    RoleClaim Add = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.UserAdmin.Add, Resource = Permissionss.UserAdmin.Resource };
                    RoleClaim View = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.UserAdmin.View, Resource = Permissionss.UserAdmin.Resource };
                    RoleClaim Edit = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.UserAdmin.Edit, Resource = Permissionss.UserAdmin.Resource };
                    RoleClaim RoleAdd = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Roles.View, Resource = Permissionss.Roles.Resource };
                    RoleClaim RoleView = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Roles.Add, Resource = Permissionss.Roles.Resource };
                    RoleClaim RoleEdit = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Roles.Edit, Resource = Permissionss.Roles.Resource };
                    RoleClaim UserRoleView = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.UserRole.Add, Resource = Permissionss.UserRole.Resource };
                    RoleClaim UserRoleAdd = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.UserRole.View, Resource = Permissionss.UserRole.Resource };
                    RoleClaim UserRoleEdit = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.UserRole.Edit, Resource = Permissionss.UserRole.Resource };

                    RoleClaim DepartmentView = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Department.View, Resource = Permissionss.Department.Resource };
                    RoleClaim PermissionView = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Permissions.View, Resource = Permissionss.Permissions.Resource };

                    await db.Set<RoleClaim>().AddAsync(Add);
                    await db.Set<RoleClaim>().AddAsync(View);
                    await db.Set<RoleClaim>().AddAsync(Edit);
                    await db.Set<RoleClaim>().AddAsync(RoleAdd);
                    await db.Set<RoleClaim>().AddAsync(RoleView);
                    await db.Set<RoleClaim>().AddAsync(RoleEdit);
                    await db.Set<RoleClaim>().AddAsync(UserRoleView);
                    await db.Set<RoleClaim>().AddAsync(UserRoleAdd);
                    await db.Set<RoleClaim>().AddAsync(UserRoleEdit);
                    await db.Set<RoleClaim>().AddAsync(DepartmentView);
                    await db.Set<RoleClaim>().AddAsync(PermissionView);
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}
