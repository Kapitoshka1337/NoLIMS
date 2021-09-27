using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Type.GetAll;
using Application.Interfaces.Repositories.Equipment;

namespace Application.Features.Type
{
    public class ByIdTypeQuery : IRequest<Response<ViewModel>>
    {
        public int Id { get; set; }
    }

    public class ByIdTypeQueryHandler : IRequestHandler<ByIdTypeQuery, Response<ViewModel>>
    {
        private readonly ITypeRepository _repository;
        private readonly IMapper _mapper;

        public ByIdTypeQueryHandler(ITypeRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(ByIdTypeQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
                throw new ApiException($"Тип оборудования с ИД \"{query.Id}\" не найден.");

            var equipmentViewModel = _mapper.Map<ViewModel>(equipment);

            return new Response<ViewModel>(equipmentViewModel);
        }
    }
}
