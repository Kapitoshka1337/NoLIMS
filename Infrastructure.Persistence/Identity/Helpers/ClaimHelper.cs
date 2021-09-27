using Application.DTOs.Permission;
using Domain.Entities.Role;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Infrastructure.Identity.Helpers
{
    public static class ClaimHelper
    {
        public static void GetPermissions(this List<RoleClaimsViewModel> allPermissions, Type policy)
        {
            Type[] types = policy.GetNestedTypes(BindingFlags.Static | BindingFlags.Public);

            foreach (var pr in types)
            {
                FieldInfo[] fields = pr.GetFields();

                foreach (FieldInfo fi in fields)
                {
                    allPermissions.Add(new RoleClaimsViewModel { Value = fi.GetValue(null).ToString(), Type = CustomClaimTypes.Permission });
                }
            }
        }

        public static void GetPermissions(this List<RoleClaim> allPermissions, Type policy)
        {
            Type[] types = policy.GetNestedTypes(BindingFlags.Static | BindingFlags.Public);

            foreach (var pr in types)
            {
                FieldInfo[] fields = pr.GetFields();

                foreach (FieldInfo fi in fields)
                {
                    allPermissions.Add(new RoleClaim { Resource = pr.Name.ToLower(), ClaimType = CustomClaimTypes.Permission, ClaimValue = fi.GetValue(null).ToString() });
                }
            }
        }

        public static async Task AddPermissionClaim(this RoleManager<Role> roleManager, Role role, string permission)
        {
            var allClaims = await roleManager.GetClaimsAsync(role);

            if (!allClaims.Any(a => a.Type == CustomClaimTypes.Permission && a.Value == permission))
            {
                await roleManager.AddClaimAsync(role, new Claim(CustomClaimTypes.Permission, permission));
            }
        }
    }
}
