using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.UserRole.Update
{
    public class Update : IRequest<Response<bool>> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<UpdateInput> Claims { get; set; }
    }

    public class UpdateHandler : IRequestHandler<Update, Response<bool>>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRoleClaimRepository _roleClaimRepository;
        private readonly IMapper _mapper;

        public UpdateHandler(IRoleRepository roleRepository, IRoleClaimRepository roleClaimRepository, IMapper mapper)
        {
            _roleClaimRepository = roleClaimRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(Update command, CancellationToken cancellationToken)
        {
            var role = await _roleRepository.GetByIdAsync(command.Id);

            if (role == null)
                throw new ApiException($"Роль с ИД \"{command.Id}\" не найдена.");

            role.Name = command.Name;

            await _roleRepository.UpdateAsync(role);

            //if (command.Claims != null)
            //{
            //    foreach (var claim in command.Claims)
            //    {
            //        var findedClaim = await _roleClaimRepository.Find(c => c.RoleId == command.Id && c.ClaimType == claim.Type && c.ClaimValue == claim.Value);

            //        if (findedClaim == null)
            //        {
            //            findedClaim.ClaimType = claim.Type;
            //            findedClaim.ClaimValue = claim.Value;
            //            findedClaim.Resource = claim.Resources;

            //            var addedClaim = await _roleClaimRepository.AddAsync(findedClaim);
            //        }
            //    }
            //}

            return new Response<bool>(true);
        }
    }
}
