using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Manufacturer
{
    public class CreateManufacturerCommand : IRequest<Response<int>>
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }

    public class CreateManufacturerCommandHandler : IRequestHandler<CreateManufacturerCommand, Response<int>>
    {
        private readonly IManufacturerRepository _manufacturerRepository;
        private readonly IMapper _mapper;
        public CreateManufacturerCommandHandler(IManufacturerRepository manufacturerRepository, IMapper mapper)
        {
            _manufacturerRepository = manufacturerRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(CreateManufacturerCommand request, CancellationToken cancellationToken)
        {
            var manufacturerDto = _mapper.Map<DTOs.Equipment.Manufacturer>(request);
            var manufacturerBase = _mapper.Map<Domain.Entities.Equipment.Manufacturer>(manufacturerDto);
            await _manufacturerRepository.AddAsync(manufacturerBase);

            return new Response<int>(manufacturerBase.Id);
        }
    }
}
