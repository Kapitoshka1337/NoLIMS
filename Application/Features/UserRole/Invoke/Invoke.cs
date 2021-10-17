using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Interfaces.Repositories.UserRole;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.UserRole.Invoke
{
    public class InvokeUserRole : IRequest<Response<bool>> 
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }
    }

    public class InvokeUserRoleHandler : IRequestHandler<InvokeUserRole, Response<bool>>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IMapper _mapper;

        public InvokeUserRoleHandler(IRoleRepository roleRepository, IUserRoleRepository userRoleRepository, IMapper mapper)
        {
            _userRoleRepository = userRoleRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(InvokeUserRole command, CancellationToken cancellationToken)
        {
            var role = await _roleRepository.GetByIdAsync(command.RoleId);

            if (role == null)
                throw new ApiException($"Роль с ИД \"{command.RoleId}\" не найдена.");

            Domain.Entities.User.UserRole ur = new Domain.Entities.User.UserRole() { UserId = command.UserId, RoleId = command.RoleId };

            await _userRoleRepository.DeleteAsync(ur);

            return new Response<bool>(true);
        }
    }
}
