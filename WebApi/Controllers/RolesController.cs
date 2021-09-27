using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Identity.Models;
using System.Threading.Tasks;
using Application.DTOs.Role;
using Domain.Entities.Role;
using AutoMapper;
using Application.Features.Role.GetAll;

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

        [HttpPost("update/{id:int}")]
        [Authorize(Policy = PolicyTypes.Roles.Edit)]
        public async Task<IActionResult> Put(int id, [FromQuery]string request)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());

            role.Name = request;

            return Ok(await _roleManager.UpdateAsync(role));
        }

        [HttpPost("delete/{id:int}")]
        [Authorize(Policy = PolicyTypes.Roles.Delete)]
        public async Task<IActionResult> Delete(int id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());

            if (role != null)
                if (role.IsSystem)
                    return Conflict();

            return Ok(await _roleManager.DeleteAsync(role));
        }
    }
}
