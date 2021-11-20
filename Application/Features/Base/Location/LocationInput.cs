using Application.Interfaces.Repositories.Base;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Location
{
    public class LocationInput : IRequest<Response<int>>
    {
        public string NumberRoom { get; set; }
        public int DepartmentId { get; set; }
    }

    public class LocationInputHandler : IRequestHandler<LocationInput, Response<int>>
    {
        private readonly ILocationRepository _repository;
        private readonly IMapper _mapper;
        
        public LocationInputHandler(ILocationRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(LocationInput request, CancellationToken cancellationToken)
        {
            var dto = _mapper.Map<DTOs.Base.Location>(request);
            var bases = _mapper.Map<Domain.Entities.Base.Location>(dto);
            var addedItem = await _repository.AddAsync(bases);

            return new Response<int>(addedItem.Id);
        }
    }
}
