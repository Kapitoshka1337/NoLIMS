using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Type
{
    public class CreateTypeCommand : IRequest<Response<int>>
    {
        public string Name { get; set; }
    }

    public class CreateTypeCommandHandler : IRequestHandler<CreateTypeCommand, Response<int>>
    {
        private readonly ITypeRepository _documentKindRepository;
        private readonly IMapper _mapper;

        public CreateTypeCommandHandler(ITypeRepository documentKindRepository, IMapper mapper)
        {
            _documentKindRepository = documentKindRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(CreateTypeCommand request, CancellationToken cancellationToken)
        {
            //var documentKindDto = _mapper.Map<DTOs.Equipment.Type>(request);
            var documentKindBase = _mapper.Map<Domain.Entities.Equipment.Type>(request);

            await _documentKindRepository.AddAsync(documentKindBase);

            return new Response<int>(documentKindBase.Id);
        }
    }
}
