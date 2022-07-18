using Application.Features.Instruction;
using Application.Features.Instruction.GetAll;
using AutoMapper;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class InstructionController : BaseApiController
    {
        private readonly IMapper _mapper;

        public InstructionController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Instruction.Add)]
        public async Task<IActionResult> Post(InstructionInput command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("delete/{id}")]
        [Authorize(Policy = PolicyTypes.Instruction.Delete)]
        public async Task<IActionResult> Delete([FromRoute] DeleteInstructionCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Instruction.View)]
        public async Task<IActionResult> Get([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.Instruction.View)]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new ByIdQuery() { Id = id }));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.Instruction.Edit)]
        public async Task<IActionResult> Put(InstructionUpdate command)
        {
           return Ok(await Mediator.Send(command));
        }
    }
}
