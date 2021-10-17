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
        public async Task<IActionResult> Grant(Grant query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("invoke")]
        [Authorize(Policy = PolicyTypes.UserRole.Edit)]
        public async Task<IActionResult> Invoke(Invoke query)
        {
            return Ok(await Mediator.Send(query));
        }

        //[HttpPost("add")]
        //[Authorize(Policy = PolicyTypes.UserRole.Add)]
        //public async Task<IActionResult> Add(UserRoleRequest request)
        //{
        //    var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        //    var role = await _roleManager.FindByIdAsync(request.RoleId.ToString());

        //    return Ok(await _userManager.AddToRoleAsync(user, role.Name));
        //}

        //[HttpPost("update")]
        //[Authorize(Policy = PolicyTypes.UserRole.Edit)]
        //public async Task<IActionResult> Put(UserRoleUpdateRequest request)
        //{
        //    var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        //    var oldRole = await _roleManager.FindByIdAsync(request.OldRoleId.ToString());
        //    var newRole = await _roleManager.FindByIdAsync(request.NewRoleId.ToString());
        //    var result = await _userManager.RemoveFromRoleAsync(user, oldRole.Name);

        //    return Ok(await _userManager.AddToRoleAsync(user, newRole.Name));
        //}

        //[HttpPost("delete")]
        //[Authorize(Policy = PolicyTypes.UserRole.Delete)]
        //public async Task<IActionResult> Delete(UserRoleRequest request)
        //{
        //    var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        //    var role = await _roleManager.FindByIdAsync(request.RoleId.ToString());

        //    return Ok(await _userManager.RemoveFromRoleAsync(user, role.Name));
        //}
    }
}
