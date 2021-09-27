using Application.DTOs.Role;
using Domain.Entities.Role;
using Infrastructure.Identity.Models;
using Infrastructure.Identity.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
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
        public async Task<IActionResult> GetAll(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return Ok(await _userManager.GetRolesAsync(user));
        }

        [HttpPost("add")]
        [Authorize(Policy = PolicyTypes.UserRole.Add)]
        public async Task<IActionResult> Add(UserRoleRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId.ToString());
            var role = await _roleManager.FindByIdAsync(request.RoleId.ToString());

            return Ok(await _userManager.AddToRoleAsync(user, role.Name));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.UserRole.Edit)]
        public async Task<IActionResult> Put(UserRoleUpdateRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId.ToString());
            var oldRole = await _roleManager.FindByIdAsync(request.OldRoleId.ToString());
            var newRole = await _roleManager.FindByIdAsync(request.NewRoleId.ToString());
            var result = await _userManager.RemoveFromRoleAsync(user, oldRole.Name);

            return Ok(await _userManager.AddToRoleAsync(user, newRole.Name));
        }

        [HttpPost("delete")]
        [Authorize(Policy = PolicyTypes.UserRole.Delete)]
        public async Task<IActionResult> Delete(UserRoleRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId.ToString());
            var role = await _roleManager.FindByIdAsync(request.RoleId.ToString());
            
            return Ok(await _userManager.RemoveFromRoleAsync(user, role.Name));
        }
    }
}
