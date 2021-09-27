using Application.DTOs.Storage;
using Application.Interfaces.Repositories.Storage;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Storage
{
    public class CreateFileCommand : FileDto, IRequest<Response<int>>
    {
    }

    public class CreateFileCommandHandler : IRequestHandler<CreateFileCommand, Response<int>>
    {
        private readonly IFileRepository _fileRepository;
        private readonly IMapper _mapper;
        public CreateFileCommandHandler(IFileRepository fileRepository, IMapper mapper)
        {
            _fileRepository= fileRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(CreateFileCommand request, CancellationToken cancellationToken)
        {
            var fileDto = _mapper.Map<DTOs.Storage.FileDto>(request);
            var fileBase = _mapper.Map<Domain.Entities.Storage.File>(fileDto);
          
            await _fileRepository.AddAsync(fileBase);

            return new Response<int>(fileBase.Id);
        }
    }
}
