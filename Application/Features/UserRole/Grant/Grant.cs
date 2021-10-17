using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Interfaces.Repositories.UserRole;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.UserRole.Grant
{
    public class GrantUserRole : IRequest<Response<Domain.Entities.User.UserRole>> 
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }
    }

    public class GrantUserRoleHandler : IRequestHandler<GrantUserRole, Response<Domain.Entities.User.UserRole>>
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;

        public GrantUserRoleHandler(IUserRoleRepository userRoleRepository, IRoleRepository roleRepository, IMapper mapper)
        {
            _userRoleRepository = userRoleRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<Domain.Entities.User.UserRole>> Handle(GrantUserRole command, CancellationToken cancellationToken)
        {
            var role = await _roleRepository.GetByIdAsync(command.RoleId);

            if (role == null)
                throw new ApiException($"Роль с ИД \"{command.RoleId}\" не найдена.");

            Domain.Entities.User.UserRole ur = new Domain.Entities.User.UserRole() { UserId = command.UserId, RoleId = command.RoleId};

            var addedUserRole = await _userRoleRepository.AddAsync(ur);

            return new Response<Domain.Entities.User.UserRole>(addedUserRole);
        }
    }
}
