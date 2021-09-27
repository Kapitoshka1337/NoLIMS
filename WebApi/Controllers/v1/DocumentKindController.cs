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

        //[HttpPost("delete/{id}")]
        //[Authorize(Policy = PolicyTypes.Equipment.Delete)]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    return Ok(await Mediator.Send(new DeleteProductByIdCommand { Id = id }));
        //}

        [HttpGet]
        [Authorize(Policy = PolicyTypes.DocumentKind.View)]
        public async Task<IActionResult> Get([FromQuery] GetAllDocumentKindParameter filter)
        {
            return Ok(await Mediator.Send(new GetAllDocumentKindQuery() { PageSize = filter.PageSize, PageNumber = filter.PageNumber }));
        }

        //[HttpPost("update/{id}")]
        //[Authorize(Policy = PolicyTypes.DocumentKind.Edit)]
        //public async Task<IActionResult> Put(int id, UpdateEquipmentCommand command)
        //{
        //    if (id != command.Id)
        //    {
        //        return BadRequest();
        //    }

        //    return Ok(await Mediator.Send(command));
        //}
    }
}
