using Application.Features.Tags;
using Application.Features.Tags.GetAll;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class TagsController : BaseApiController
    {
        [HttpGet]
        [Authorize(Policy = PolicyTypes.Tags.View)]
        public async Task<IActionResult> Get([FromQuery] Parameter filter)
        {
            return Ok(await Mediator.Send(new Query() { PageSize = filter.PageSize, PageNumber = filter.PageNumber }));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.Tags.View)]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new ByIdTagQuery() { Id = id }));
        }
    }
}
