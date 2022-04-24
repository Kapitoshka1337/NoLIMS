using Application.Features.UserRole.GetAll;
using Application.Features.UserRole.Grant;
using Application.Features.UserRole.Invoke;
using Domain.Entities.Role;
using Infrastructure.Identity.Models;
using Domain.Entities.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiVersion("1.0")]
    public class UserRoleController : BaseApiController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public UserRoleController(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.UserRole.View)]
        public async Task<IActionResult> GetAll([FromQuery] Query query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("grant")]
        [Authorize(Policy = PolicyTypes.UserRole.Edit)]
        public async Task<IActionResult> Grant(GrantUserRole query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("invoke")]
        [Authorize(Policy = PolicyTypes.UserRole.Edit)]
        public async Task<IActionResult> Invoke(InvokeUserRole query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
