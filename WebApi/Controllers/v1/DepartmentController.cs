using Application.Features.Base.Department;
using Application.Features.Base.Department.GetAll;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AutoMapper;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class DepartmentController : BaseApiController
    {
        private readonly IMapper _mapper;
        
        public DepartmentController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Department.Add)]
        public async Task<IActionResult> Post(DepartmentInput command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("delete/{id}")]
        [Authorize(Policy = PolicyTypes.Department.Delete)]
        public async Task<IActionResult> Delete([FromRoute] DeleteDepartmentCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Department.View)]
        public async Task<IActionResult> Get([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.Department.View)]
        public async Task<IActionResult> GetById([FromRoute] ByIdQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
        
        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.Department.Edit)]
        public async Task<IActionResult> Put(UpdateDepartment command)
        {
           return Ok(await Mediator.Send(command));
        }
    }
}
