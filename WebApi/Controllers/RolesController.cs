using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Identity.Models;
using System.Threading.Tasks;
using Application.DTOs.Role;
using Domain.Entities.Role;
using AutoMapper;
using Application.Features.Role.GetAll;
using Application.Features.Role.Update;
using Application.Features.Role.Grant;
using Application.Features.Role.Invoke;
using Application.Features.Role.Delete;

namespace WebApi.Controllers
{
    [ApiVersion("1.0")]
    public class RolesController : BaseApiController
    {
        private readonly RoleManager<Role> _roleManager;
        private readonly IMapper _mapper;
        public RolesController(RoleManager<Role> roleManager, IMapper mapper)
        {
            _roleManager = roleManager;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Roles.View)]
        public async Task<IActionResult> GetAll([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Roles.Add)]
        public async Task<IActionResult> Add(RoleRequest request)
        {
            return Ok(await _roleManager.CreateAsync(new Role(request.Name)));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.Roles.Edit)]
        public async Task<IActionResult> Put(Update query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("grant")]
        [Authorize(Policy = PolicyTypes.Roles.Edit)]
        public async Task<IActionResult> Grant(Grant query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("invoke")]
        [Authorize(Policy = PolicyTypes.Roles.Edit)]
        public async Task<IActionResult> Invoke(Invoke query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("delete")]
        [Authorize(Policy = PolicyTypes.Roles.Delete)]
        public async Task<IActionResult> Delete(DeleteRole query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
