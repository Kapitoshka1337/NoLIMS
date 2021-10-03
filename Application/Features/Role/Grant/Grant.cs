using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Role.Grant
{
    public class Grant : IRequest<Response<Domain.Entities.Role.RoleClaim>> 
    {
        public int RoleId { get; set; }
        public string Resource { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
    }

    public class GrantHandler : IRequestHandler<Grant, Response<Domain.Entities.Role.RoleClaim>>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRoleClaimRepository _roleClaimRepository;
        private readonly IMapper _mapper;

        public GrantHandler(IRoleRepository roleRepository, IRoleClaimRepository roleClaimRepository, IMapper mapper)
        {
            _roleClaimRepository = roleClaimRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<Domain.Entities.Role.RoleClaim>> Handle(Grant command, CancellationToken cancellationToken)
        {
            var commandRoleClaim = await _roleRepository.GetByIdAsync(command.RoleId);

            if (commandRoleClaim == null)
                throw new ApiException($"Роль с ИД \"{command.RoleId}\" не найдена.");

            var roleClaimDto = _mapper.Map<Application.DTOs.Role.RoleClaimDto>(command);
            var roleClaim = _mapper.Map<Domain.Entities.Role.RoleClaim>(roleClaimDto);

            var addedRoleClaim = await _roleClaimRepository.AddAsync(roleClaim);

            return new Response<Domain.Entities.Role.RoleClaim>(roleClaim);
        }
    }
}
