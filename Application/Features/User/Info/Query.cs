using Application.Interfaces;
using Application.Interfaces.Repositories.User;
using Application.Wrappers;
using AutoMapper;
using Domain.Entities.User;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.User.Info
{
    public class QueryInfo : IRequest<Response<ViewModel>>
    {
        public string Id { get; set; }
    }

    public class QueryInfoHandler : IRequestHandler<QueryInfo, Response<ViewModel>>
    {
        private readonly IUserRepository _repository;
        private readonly IUserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<Domain.Entities.Role.Role> _roleManager;
        private readonly IMapper _mapper;

        public QueryInfoHandler(IUserRepository repository, IUserService userService, UserManager<ApplicationUser> userManager, RoleManager<Domain.Entities.Role.Role> roleManager, IMapper mapper)
        {
            _repository = repository;
            _userService = userService;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<Response<ViewModel>> Handle(QueryInfo request, CancellationToken cancellationToken)
        {
            var viewModel = new ViewModel();
            var permissions = new List<string>();
            var claims = await _userService.GetPermission(int.Parse(request.Id));
            var user = await _userManager.FindByIdAsync(request.Id);
            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                var rl = await _roleManager.FindByNameAsync(role);
                var cls = await _roleManager.GetClaimsAsync(rl);

                foreach (var claim in cls)
                {
                    permissions.Add(claim.Value);
                }
            }

            viewModel.Id = claims.Id;
            viewModel.UserName = $"{user.FirstName} {user.MiddleName} {user.LastName}";
            viewModel.Claims = claims.Claims;
            viewModel.Roles = roles;
            viewModel.Permissions = permissions;
            
            return new Response<ViewModel>(viewModel);
        }
    }
}
