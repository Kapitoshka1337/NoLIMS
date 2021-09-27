using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DocumentKind
{
    public class CreateDocumentKindCommand : IRequest<Response<int>>
    {
        public string Name { get; set; }
    }

    public class CreateDocumentKindCommandHandler : IRequestHandler<CreateDocumentKindCommand, Response<int>>
    {
        private readonly IDocumentKindRepository _documentKindRepository;
        private readonly IMapper _mapper;
        public CreateDocumentKindCommandHandler(IDocumentKindRepository documentKindRepository, IMapper mapper)
        {
            _documentKindRepository = documentKindRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(CreateDocumentKindCommand request, CancellationToken cancellationToken)
        {
            var documentKindDto = _mapper.Map<DTOs.Equipment.DocumentKindDto>(request);
            var documentKindBase = _mapper.Map<Domain.Entities.Equipment.DocumentKind>(documentKindDto);

            await _documentKindRepository.AddAsync(documentKindBase);

            return new Response<int>(documentKindBase.Id);
        }
    }
}
