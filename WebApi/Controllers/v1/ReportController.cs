using Application.Features.Reports.Stricker;
using Application.Features.Reports.CheckTable;
using Application.Features.Reports.Csm;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class ReportController : BaseApiController
    {
        [HttpPost("sticker")]
        [AllowAnonymous]
        public async Task<IActionResult> Sticker(Query command)
        {
            var result = await Mediator.Send(command);

            if (string.IsNullOrEmpty(result))
                return BadRequest();

            var basePath = Path.Combine(Directory.GetCurrentDirectory(), $"uploads\\generated\\{result}");

            if (!System.IO.File.Exists(basePath))
                return BadRequest();

            var fileData = await System.IO.File.ReadAllBytesAsync(basePath);
            var content = new MemoryStream(fileData);
            var contentType = "application/pdf";

            return File(content, contentType, result);
        }

        [HttpPost("checktable")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckTable(QueryCheck command)
        {
            var result = await Mediator.Send(command);

            if (string.IsNullOrEmpty(result))
                return BadRequest();

            var basePath = Path.Combine(Directory.GetCurrentDirectory(), $"uploads\\generated\\{result}");
            var fileData = await System.IO.File.ReadAllBytesAsync(basePath);
            var content = new MemoryStream(fileData);
            var contentType = "application/pdf";

            return File(content, contentType, result);
        }

        [HttpPost("csm")]
        [AllowAnonymous]
        public async Task<IActionResult> Csm(QueryCsm command)
        {
            var result = await Mediator.Send(command);

            if (string.IsNullOrEmpty(result))
                return BadRequest();

            var basePath = Path.Combine(Directory.GetCurrentDirectory(), $"uploads\\generated\\{result}");
            var fileData = await System.IO.File.ReadAllBytesAsync(basePath);
            var content = new MemoryStream(fileData);
            var contentType = "application/pdf";

            return File(content, contentType, result);
        }
    }
}
