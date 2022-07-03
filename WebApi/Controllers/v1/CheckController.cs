using Application.Features.Check;
using Application.Features.Check.GetAll;
using Application.Features.Check.Update;
using AutoMapper;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class CheckController : BaseApiController
    {
        private readonly IMapper _mapper;

        public CheckController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Checks.Add)]
        public async Task<IActionResult> Post(PassedCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Checks.View)]
        public async Task<IActionResult> Get([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpPost("delete")]
        [Authorize(Policy = PolicyTypes.Checks.Delete)]
        public async Task<IActionResult> Delete(DeleteCheckCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.Checks.View)]
        public async Task<IActionResult> GetById([FromRoute] GetOne query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.Checks.Edit)]
        public async Task<IActionResult> Put(UpdateCheck command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
