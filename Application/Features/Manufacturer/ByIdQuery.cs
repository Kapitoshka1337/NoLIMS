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
    public class ByIdQuery : IRequest<Response<GetAllManufacturerViewModel>>
    {
        public int Id { get; set; }
    }

    public class ByIdQueryHandler : IRequestHandler<ByIdQuery, Response<GetAllManufacturerViewModel>>
    {
        private readonly IManufacturerRepository _repository;
        private readonly IMapper _mapper;

        public ByIdQueryHandler(IManufacturerRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<GetAllManufacturerViewModel>> Handle(ByIdQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
            {
                string msg = $"Производитель с ИД \"{query.Id}\" не найден.";
                Response<GetAllManufacturerViewModel> rsp = new Response<GetAllManufacturerViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            var equipmentViewModel = _mapper.Map<GetAllManufacturerViewModel>(equipment);

            return new Response<GetAllManufacturerViewModel>(equipmentViewModel);
        }
    }
}
