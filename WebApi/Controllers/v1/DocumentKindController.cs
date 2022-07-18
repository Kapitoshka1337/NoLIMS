using Application.Features.DocumentKind;
using Application.Features.DocumentKind.GetAll;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class DocumentKindController : BaseApiController
    {
        [HttpPost]
        [Authorize(Policy = PolicyTypes.DocumentKind.Add)]
        public async Task<IActionResult> Post(CreateDocumentKindCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.DocumentKind.View)]
        public async Task<IActionResult> Get([FromQuery] GetAllDocumentKindParameter filter)
        {
            return Ok(await Mediator.Send(new GetAllDocumentKindQuery() { PageSize = filter.PageSize, PageNumber = filter.PageNumber }));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.DocumentKind.View)]
        public async Task<IActionResult> GetById([FromRoute] ByIdQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.DocumentKind.Edit)]
        public async Task<IActionResult> Put(UpdateDocumentKind command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("delete/{id}")]
        [Authorize(Policy = PolicyTypes.DocumentKind.Delete)]
        public async Task<IActionResult> Delete([FromRoute] DeleteDocumentKindCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
