using Application.Features.Moving.GetAll;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AutoMapper;
using Application.Features.Moving;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class MovingController : BaseApiController
    {
        private readonly IMapper _mapper;
        
        public MovingController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Moving.Add)]
        public async Task<IActionResult> Post(MovingInput command)
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
        [Authorize(Policy = PolicyTypes.Moving.View)]
        public async Task<IActionResult> Get([FromQuery] Parameter filter)
        {
            var query = _mapper.Map<Query>(filter);

            return Ok(await Mediator.Send(query));
        }

        // [HttpGet("{id}")]
        // [Authorize(Policy = PolicyTypes.Moving.View)]
        // public async Task<IActionResult> GetById(int id)
        // {
        //     return Ok(await Mediator.Send(new ByIdQuery() { Id = id }));
        // }
        
        // [HttpPost("update")]
        // [Authorize(Policy = PolicyTypes.Moving.Edit)]
        // public async Task<IActionResult> Put(UpdateMoving command)
        // {
        //    return Ok(await Mediator.Send(command));
        // }
    }
}
