using Application.Interfaces;
using Infrastructure.Identity.Models;
using Infrastructure.Identity.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(IUserService userService, UserManager<ApplicationUser> userManager)
        {
            _userService = userService;
            _userManager= userManager;
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.User.View)]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _userManager.Users.Select(u => new { u.Id, u.UserName }).ToListAsync());
        }

        [HttpGet("info")]
        [Authorize(Policy = PolicyTypes.User.View)]
        public async Task<IActionResult> GetInfo()
        {
            var userId = HttpContext.User.Claims.Where(c => c.Type == "uid").Select(c => c.Value).FirstOrDefault().ToString();
            
            return Ok(await _userService.GetPermission(int.Parse(userId)));
        }
    }
}
