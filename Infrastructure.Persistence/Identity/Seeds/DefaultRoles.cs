﻿using Infrastructure.Identity.Models;
using Infrastructure.Identity.Models.User;
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
            var adminRole = await roleManager.FindByNameAsync(Roles.Admin.ToString());
            
            if (adminRole != null)
            {
                return;
            }

            await roleManager.CreateAsync(new Role(Roles.Admin.ToString(), true));
            adminRole = await roleManager.FindByNameAsync(Roles.Admin.ToString());

            var adminClaims = await roleManager.GetClaimsAsync(adminRole);


            if (adminClaims.Count <= 0)
            {
                RoleClaim Add = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Products.Add, Resource = typeof(Permissionss.Products).Name.ToLower() };
                RoleClaim Delete = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Products.Delete, Resource = typeof(Permissionss.Products).Name.ToLower() };
                RoleClaim Edit = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Products.Edit, Resource = typeof(Permissionss.Products).Name.ToLower() };
                RoleClaim View = new RoleClaim() { RoleId = adminRole.Id, ClaimType = CustomClaimTypes.Permission, ClaimValue = Permissionss.Products.View, Resource = typeof(Permissionss.Products).Name.ToLower() };

                await db.Set<RoleClaim>().AddAsync(Add);
                await db.Set<RoleClaim>().AddAsync(Delete);
                await db.Set<RoleClaim>().AddAsync(Edit);
                await db.Set<RoleClaim>().AddAsync(View);
                await db.SaveChangesAsync();
            }
        }
    }
}
