using Application.Interfaces.Repositories.Storage;
using AutoMapper;
using Domain.Entities.Storage;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Base.Storage.GetAll;
using Application.Wrappers;

namespace Application.Features.Base.Storage
{
    public class UpdateFile : IRequest<Response<bool>>
    {
        public int CheckId { get; set; }
        public int FileId { get; set; }
    }

    public class UpdateFileHandler : IRequestHandler<UpdateFile, Response<bool>>
    {
        private readonly IFileRepository _repository;
        private readonly IMapper _mapper;

        public UpdateFileHandler(IFileRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Response<bool>> Handle(UpdateFile request, CancellationToken cancellationToken)
        {
            var file = await _repository.GetByIdAsync(request.FileId);
            ViewModel vm = new ViewModel();


            return new Response<bool>(true);
        }
    }
}
