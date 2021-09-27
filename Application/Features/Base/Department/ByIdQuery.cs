using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Base.Department.GetAll;
using Application.Interfaces.Repositories.Base;

namespace Application.Features.Base.Department
{
    public class ByIdQuery : IRequest<Response<ViewModel>>
    {
        public int Id { get; set; }
    }

    public class ByIdQueryHandler : IRequestHandler<ByIdQuery, Response<ViewModel>>
    {
        private readonly IDepartmentRepository _repository;
        private readonly IMapper _mapper;

        public ByIdQueryHandler(IDepartmentRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(ByIdQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
                throw new ApiException($"Подразделение с ИД \"{query.Id}\" не найдено.");

            var equipmentViewModel = _mapper.Map<ViewModel>(equipment);

            return new Response<ViewModel>(equipmentViewModel);
        }
    }
}
