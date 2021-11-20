using Application.Features.Base.Location;
using Application.Features.Base.Location.GetAll;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AutoMapper;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class LocationController : BaseApiController
    {
        private readonly IMapper _mapper;
        
        public LocationController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Department.Add)]
        public async Task<IActionResult> Post(LocationInput command)
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
        [Authorize(Policy = PolicyTypes.Department.View)]
        public async Task<IActionResult> Get([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = PolicyTypes.Location.View)]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new ByIdQuery() { Id = id }));
        }

        [HttpPost("update")]
        [Authorize(Policy = PolicyTypes.Location.Edit)]
        public async Task<IActionResult> Put(UpdateLocation command)
        {
           return Ok(await Mediator.Send(command));
        }
    }
}
