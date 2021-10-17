using Application.Features.User;
using Application.Features.User.GetAll;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Identity.Models;
using Domain.Entities.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(IUserService userService, UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _userService = userService;
            _userManager= userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.User.View)]
        public async Task<IActionResult> GetAll([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpGet("info")]
        [Authorize(Policy = PolicyTypes.User.View)]
        public async Task<IActionResult> GetInfo()
        {
            var userId = HttpContext.User.Claims.Where(c => c.Type == "uid").Select(c => c.Value).FirstOrDefault().ToString();
            
            return Ok(await _userService.GetPermission(int.Parse(userId)));
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.User.Add)]
        public async Task<IActionResult> Post(Create command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
