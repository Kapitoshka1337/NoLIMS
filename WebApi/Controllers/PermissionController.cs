using Application.DTOs.Permission;
using Domain.Entities.Role;
using Infrastructure.Identity.Helpers;
using Infrastructure.Identity.Models;
using Infrastructure.Identity.Models.Permisson;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly RoleManager<Role> _roleManager;
        public PermissionController(RoleManager<Role> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Permissions.View)]
        public async Task<ActionResult> GetAll()
        {
            var model = new PermissionViewModel();
            var allPermissions = new List<RoleClaimsViewModel>();
            allPermissions.GetPermissions(typeof(Permissionss));

            model.RoleId = null;
            model.Claims = allPermissions;

            return Ok(model);
        }

        [HttpGet("{roleId:int}")]
        [Authorize(Policy = PolicyTypes.Permissions.View)]
        public async Task<ActionResult> GetByRoleId(string roleId)
        {
            var model = new PermissionViewModel();
            var allPermissions = new List<RoleClaimsViewModel>();
            allPermissions.GetPermissions(typeof(Permissionss));

            var role = await _roleManager.FindByIdAsync(roleId);
            var claims = await _roleManager.GetClaimsAsync(role);
            var allClaimValues = allPermissions.Select(a => a.Value).ToList();
            var roleClaimValues = claims.Select(a => a.Value).ToList();
            var authorizedClaims = allClaimValues.Intersect(roleClaimValues).ToList();

            foreach (var permission in allPermissions)
            {
                if (authorizedClaims.Any(a => a == permission.Value))
                {
                    permission.IsGranted = true;
                }
            }

            model.RoleId = roleId;
            model.Claims = allPermissions;
            
            return Ok(model);
        }

        //public async Task<IActionResult> Update(PermissionViewModel model)
        //{
        //    var role = await _roleManager.FindByIdAsync(model.RoleId);
        //    var claims = await _roleManager.GetClaimsAsync(role);
        //    foreach (var claim in claims)
        //    {
        //        await _roleManager.RemoveClaimAsync(role, claim);
        //    }
        //    var selectedClaims = model.RoleClaims.Where(a => a.Selected).ToList();
        //    foreach (var claim in selectedClaims)
        //    {
        //        await _roleManager.AddPermissionClaim(role, claim.Value);
        //    }
        //    return RedirectToAction("Index", new { roleId = model.RoleId });
        //}
    }
}
