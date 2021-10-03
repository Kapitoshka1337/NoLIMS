using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Role.Invoke
{
    public class Invoke : IRequest<Response<bool>> 
    {
        public int RoleId { get; set; }
        public string Resource { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
    }

    public class InvokeHandler : IRequestHandler<Invoke, Response<bool>>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRoleClaimRepository _roleClaimRepository;
        private readonly IMapper _mapper;

        public InvokeHandler(IRoleRepository roleRepository, IRoleClaimRepository roleClaimRepository, IMapper mapper)
        {
            _roleClaimRepository = roleClaimRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(Invoke command, CancellationToken cancellationToken)
        {
            var commandRoleClaim = await _roleRepository.GetByIdAsync(command.RoleId);
            var claim = await _roleClaimRepository.Find(c => c.ClaimType == command.ClaimType && c.ClaimValue == command.ClaimValue && c.Resource == command.Resource && c.RoleId == command.RoleId);

            if (commandRoleClaim == null || claim == null)
                throw new ApiException($"Роль с ИД \"{command.RoleId}\" или право доступа не найдено.");

            await _roleClaimRepository.DeleteAsync(claim);

            return new Response<bool>(true);
        }
    }
}
