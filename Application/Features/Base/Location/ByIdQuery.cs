using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Base.Location.GetAll;
using Application.Interfaces.Repositories.Base;

namespace Application.Features.Base.Location
{
    public class ByIdQuery : IRequest<Response<ViewModelDepId>>
    {
        public int Id { get; set; }
    }

    public class ByIdQueryHandler : IRequestHandler<ByIdQuery, Response<ViewModelDepId>>
    {
        private readonly ILocationRepository _repository;
        private readonly IMapper _mapper;

        public ByIdQueryHandler(ILocationRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModelDepId>> Handle(ByIdQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
                throw new ApiException($"Местоположение с ИД \"{query.Id}\" не найдено.");

            var equipmentViewModel = _mapper.Map<ViewModelDepId>(equipment);

            return new Response<ViewModelDepId>(equipmentViewModel);
        }
    }
}
