using Application.Features.Verification;
using Application.Features.Verification.GetAllVerification;
using AutoMapper;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class VerificationController : BaseApiController
    {
        private readonly IMapper _mapper;

        public VerificationController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Policy = PolicyTypes.Verification.Add)]
        public async Task<IActionResult> Post(CreateVerificationCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet]
        [Authorize(Policy = PolicyTypes.Verification.View)]
        public async Task<IActionResult> Get([FromQuery] GetAllVerificationParameter filter)
        {
            var query = _mapper.Map<GetAllVerificationQuery>(filter);

            return Ok(await Mediator.Send(query));
        }

        [HttpPost("delete")]
        [Authorize(Policy = PolicyTypes.Verification.Delete)]
        public async Task<IActionResult> Delete(DeleteVerificationCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("reset")]
        [Authorize(Policy = PolicyTypes.Verification.Edit)]
        public async Task<IActionResult> Put(ResetCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("play")]
        [Authorize(Policy = PolicyTypes.Verification.Add)]
        public async Task<IActionResult> Play(PlayVerificationCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
