using Application.Features.Manufacturer;
using Application.Features.Manufacturer.GetAll;
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
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new ByIdManufacturerQuery() { Id = id }));
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
