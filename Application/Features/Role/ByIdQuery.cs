using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces.Repositories.Equipment;
using Application.Features.Role.GetAll;

namespace Application.Features.Role
{
    public class ByIdQuery : IRequest<Response<ViewModel>>
    {
        public int Id { get; set; }
    }

    public class ByIdQueryHandler : IRequestHandler<ByIdQuery, Response<ViewModel>>
    {
        private readonly IRoleRepository _repository;
        private readonly IMapper _mapper;

        public ByIdQueryHandler(IRoleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(ByIdQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
            {
                string msg = $"Роль с ИД \"{query.Id}\" не найдена.";
                Response<ViewModel> rsp = new Response<ViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            var equipmentViewModel = _mapper.Map<ViewModel>(equipment);

            return new Response<ViewModel>(equipmentViewModel);
        }
    }
}
