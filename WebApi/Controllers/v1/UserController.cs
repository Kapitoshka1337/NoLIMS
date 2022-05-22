using Application.Features.User;
using Application.Features.User.GetAll;
using Application.Features.User.GetById;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.User.Update;
using Application.Features.User.Info;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.User.View)]
        public async Task<IActionResult> GetAll([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.User.View)]
        public async Task<IActionResult> GetById([FromRoute] QueryById request)
        {
            var query = _mapper.Map<QueryById>(request);

            return Ok(await Mediator.Send(query));
        }

        [HttpGet("info")]
        [Authorize(Policy = PolicyTypes.User.Info)]
        public async Task<IActionResult> GetInfo()
        {
            var query = new QueryInfo() { Id = HttpContext.User.Claims.Where(c => c.Type == "uid").Select(c => c.Value).FirstOrDefault().ToString() };

            return Ok(await Mediator.Send(query));
            //var userId = HttpContext.User.Claims.Where(c => c.Type == "uid").Select(c => c.Value).FirstOrDefault().ToString();

            //return Ok(await _userService.GetPermission(int.Parse(userId)));
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.User.Add)]
        public async Task<IActionResult> Post(Create command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.User.Edit)]
        public async Task<IActionResult> Update(UpdateUser query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("delete")]
        [Authorize(Policy = PolicyTypes.User.Delete)]
        public async Task<IActionResult> Delete(DeleteUser query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
