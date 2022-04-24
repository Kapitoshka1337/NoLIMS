using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Role.Update
{
    public class Update : IRequest<Response<bool>> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        //public IList<UpdateInput> Claims { get; set; }
    }

    public class UpdateHandler : IRequestHandler<Update, Response<bool>>
    {
        private readonly IRoleRepository _roleRepository;
        //private readonly IRoleClaimRepository _roleClaimRepository;
        private readonly IMapper _mapper;

        public UpdateHandler(IRoleRepository roleRepository, IMapper mapper)
        {
            //_roleClaimRepository = roleClaimRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(Update command, CancellationToken cancellationToken)
        {
            var role = await _roleRepository.GetByIdAsync(command.Id);

            if (role == null)
                throw new ApiException($"Роль с ИД \"{command.Id}\" не найдена.");

            role.Name = command.Name;
            role.NormalizedName = command.Name.ToUpper();

            await _roleRepository.UpdateAsync(role);

            return new Response<bool>(true);
        }
    }
}
