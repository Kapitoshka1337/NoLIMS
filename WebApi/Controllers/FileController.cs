using Application.Features.Base.Storage.GetAll;
using Application.Features.Storage;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : BaseApiController
    {
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        [Authorize(Policy = PolicyTypes.File.Add)]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            if (this.Request.Form.Files.Any())
            {
                var formFile = this.Request.Form.Files.FirstOrDefault();

                Stream st = formFile.OpenReadStream();
                MemoryStream mst = new MemoryStream();
                await st.CopyToAsync(mst);
                var hash = ToMD5Hash(mst.ToArray());

                var basePath = Path.Combine(Directory.GetCurrentDirectory() + "\\uploads\\");

                if (!Directory.Exists(basePath))
                    Directory.CreateDirectory(basePath);

                var uniqueFileName = string.Concat(hash, Path.GetExtension(formFile.FileName));
                var filePath = Path.Combine(basePath, uniqueFileName);

                if (!System.IO.File.Exists(filePath))
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }

                var fileCommand = new CreateFileCommand()
                {
                    Hash = uniqueFileName,
                    Size = formFile.Length,
                    Type = formFile.ContentType == null ? "text/plain" : formFile.ContentType
                };

                return Ok(await Mediator.Send(fileCommand));
            }

            if (file != null || file.Length > 0)
            {
                Stream st = file.OpenReadStream();
                MemoryStream mst = new MemoryStream();
                await st.CopyToAsync(mst);
                var hash = ToMD5Hash(mst.ToArray());

                var basePath = Path.Combine(Directory.GetCurrentDirectory() + "\\uploads\\");

                if (!Directory.Exists(basePath))
                    Directory.CreateDirectory(basePath);

                var uniqueFileName = string.Concat(hash, Path.GetExtension(file.FileName));
                var filePath = Path.Combine(basePath, uniqueFileName);

                if (!System.IO.File.Exists(filePath))
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                var fileCommand = new CreateFileCommand()
                {
                    Hash = uniqueFileName,
                    Size = file.Length,
                    Type = file.ContentType == null ? "text/plain" : file.ContentType
                };

                return Ok(await Mediator.Send(fileCommand));
            }

            return BadRequest();
        }

        [HttpGet("download")]
        [Authorize(Policy = PolicyTypes.File.View)]
        public async Task<IActionResult> Download([FromQuery] Parameter request)
        {
            var file = await Mediator.Send(new Query() { FileId = request.FileId });
            
            if (file == null)
                return BadRequest();

            var basePath = Path.Combine(Directory.GetCurrentDirectory() + "\\uploads\\");
            var filePath = Path.Combine(basePath, file.Hash);
            var fileData = await System.IO.File.ReadAllBytesAsync(filePath);
            var content = new MemoryStream(fileData);
            var contentType = file.Type;

            return File(content, contentType, file.Hash);
        }

        private string ToMD5Hash(byte[] bytes)
        {
            if (bytes == null || bytes.Length == 0)
                return string.Empty;

            using (var md5 = MD5.Create())
            {
                return string.Join("", md5.ComputeHash(bytes).Select(x => x.ToString("X2")));
            }
        }
    }
}
