using Application.Interfaces;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Identity.Permission
{
    internal class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IPermissionService _permissionService;

        public PermissionAuthorizationHandler () 
        {
            //_permissionService = permissionService;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            if (context.User == null)
            {
                return;
            }

            var permissionSplit = requirement.Permission.Split(".");
            var permission = string.Concat(permissionSplit[1], ".", permissionSplit[2]);

            var permissionss = context.User.Claims.Where(x => x.Type == CustomClaimTypes.Permission && x.Value == permission && x.Issuer == "CoreIdentity");
            //var permissionss = await _permissionService.IsUserGrantedToPermissionAsync(context.User.Identity.Name, requirement.Permission);

            if (permissionss.Any())
            {
                context.Succeed(requirement);
                return;
            }
        }
    }
}
