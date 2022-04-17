using Application.Features.Manufacturer;
using Application.Features.Manufacturer.GetAll;
using Application.Features.Manufacturer.Update;
using AutoMapper;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class ManufacturerController : BaseApiController
    {
        private readonly IMapper _mapper;

        public ManufacturerController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Manufacturer.Add)]
        public async Task<IActionResult> Post(CreateManufacturerCommand command)
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
        [Authorize(Policy = PolicyTypes.Manufacturer.View)]
        public async Task<IActionResult> Get([FromQuery] GetAllManufacturerParameter filter)
        {
            var query = _mapper.Map<GetAllManufacturerQuery>(filter);
            return Ok(await Mediator.Send(query));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.Manufacturer.View)]
        public async Task<IActionResult> GetById([FromRoute] ByIdQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.Manufacturer.Edit)]
        public async Task<IActionResult> Put(UpdateManufacturer command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
