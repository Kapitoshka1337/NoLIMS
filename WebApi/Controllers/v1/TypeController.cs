using Application.Features.Type;
using Application.Features.Type.GetAll;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class TypeController : BaseApiController
    {
        [HttpPost]
        [Authorize(Policy = PolicyTypes.DocumentKind.Add)]
        public async Task<IActionResult> Post(CreateTypeCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Type.View)]
        public async Task<IActionResult> Get([FromQuery] Parameter filter)
        {
            return Ok(await Mediator.Send(new Query() { PageSize = filter.PageSize, PageNumber = filter.PageNumber }));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.Type.View)]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new ByIdTypeQuery() { Id = id }));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.Type.Edit)]
        public async Task<IActionResult> Put(UpdateType command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
