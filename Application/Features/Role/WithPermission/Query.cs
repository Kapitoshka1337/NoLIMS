using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Role.WithPermission
{
    public class GetRoles : IRequest<Response<IList<ViewModel>>>
    {}

    public class GetRolesHandler : IRequestHandler<GetRoles, Response<IList<ViewModel>>>
    {
        private readonly IRoleRepository _repository;
        private readonly RoleManager<Domain.Entities.Role.Role> _roleManager;
        private readonly IMapper _mapper;

        public GetRolesHandler(IRoleRepository repository, RoleManager<Domain.Entities.Role.Role> roleManager, IMapper mapper)
        {
            _repository = repository;
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<Response<IList<ViewModel>>> Handle(GetRoles request, CancellationToken cancellationToken)
        {
            var roles = await _repository.GetAllAsync();
            var viewModel = new List<ViewModel>();

            foreach(var role in roles)
            {
                var rl = new ViewModel() { Role = role.Name };
                var claims = await _roleManager.GetClaimsAsync(role);
                var permissions = new List<string>();

                foreach (var claim in claims)
                {
                    permissions.Add(claim.Value);
                }

                rl.Permissions = permissions;
                viewModel.Add(rl);
            }

            return new Response<IList<ViewModel>>(viewModel);
        }
    }
}
