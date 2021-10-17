using Application.Interfaces.Repositories.Equipment;
using Application.Interfaces.Repositories.UserRole;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.UserRole.GetAll
{
    public class Query : IRequest<Response<IEnumerable<ViewModel>>>
    {
        public int UserId { get; set; }
    }

    public class QueryHandler : IRequestHandler<Query, Response<IEnumerable<ViewModel>>>
    {
        private readonly IRoleRepository _repository;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IMapper _mapper;

        public QueryHandler(IRoleRepository repository, IUserRoleRepository userRole, IMapper mapper)
        {
            _repository = repository;
            _userRoleRepository = userRole;
            _mapper = mapper;
        }

        public async Task<Response<IEnumerable<ViewModel>>> Handle(Query request, CancellationToken cancellationToken)
        {
            List<ViewModel> model = new List<ViewModel>();
            var userRole = await _userRoleRepository.Find(r => r.UserId == request.UserId);
            var userRoleIds = userRole.Select(r => r.RoleId);
            var roles = await _repository.GetAllAsync();
            var userRoles = roles.Where(r => userRoleIds.Contains(r.Id));

            foreach (var role in roles)
            {
                var view = new ViewModel();
                view.Id = role.Id;
                view.Name = role.Name;
                view.IsGranted = false;

                if (userRoles.Any(a => a == role))
                {
                    view.IsGranted = true;
                }

                model.Add(view);
            }

            return new Response<IEnumerable<ViewModel>>(model);
        }
    }
}
