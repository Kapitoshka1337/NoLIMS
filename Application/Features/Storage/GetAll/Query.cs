using Application.Interfaces.Repositories.Storage;
using AutoMapper;
using Domain.Entities.Storage;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Storage.GetAll
{
    public class Query : IRequest<File>
    {
        public int FileId { get; set; }
    }

    public class QueryHandler : IRequestHandler<Query, File>
    {
        private readonly IFileRepository _repository;
        private readonly IMapper _mapper;

        public QueryHandler(IFileRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<File> Handle(Query request, CancellationToken cancellationToken)
        {
            var file = await _repository.GetByIdAsync(request.FileId);

            return file;
        }
    }
}
