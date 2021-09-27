using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Manufacturer.GetAll;
using Application.Interfaces.Repositories.Equipment;

namespace Application.Features.Manufacturer
{
    public class ByIdManufacturerQuery : IRequest<Response<GetAllManufacturerViewModel>>
    {
        public int Id { get; set; }
    }

    public class ByIdManufacturerQueryHandler : IRequestHandler<ByIdManufacturerQuery, Response<GetAllManufacturerViewModel>>
    {
        private readonly IManufacturerRepository _repository;
        private readonly IMapper _mapper;

        public ByIdManufacturerQueryHandler(IManufacturerRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<GetAllManufacturerViewModel>> Handle(ByIdManufacturerQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
                throw new ApiException($"Производитель с ИД \"{query.Id}\" не найден.");

            var equipmentViewModel = _mapper.Map<GetAllManufacturerViewModel>(equipment);

            return new Response<GetAllManufacturerViewModel>(equipmentViewModel);
        }
    }
}
