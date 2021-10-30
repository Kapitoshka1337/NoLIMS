using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Role.Delete
{
    public class DeleteRole : IRequest<Response<bool>> 
    {
        public int RoleId { get; set; }
    }

    public class DeleteRoleHandler : IRequestHandler<DeleteRole, Response<bool>>
    {
        private readonly IRoleRepository _repository;
        private readonly IMapper _mapper;

        public DeleteRoleHandler(IRoleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(DeleteRole command, CancellationToken cancellationToken)
        {
            var role = await _repository.GetByIdAsync(command.RoleId);

            if (role == null)
                throw new ApiException($"Роль с ИД \"{command.RoleId}\" не найдена.");

            if (role.IsSystem)
                throw new ApiException($"Системную роль удалять нельзя.");

            await _repository.DeleteAsync(role);

            return new Response<bool>(true);
        }
    }
}
