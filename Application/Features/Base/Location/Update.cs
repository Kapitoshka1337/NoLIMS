using Application.Exceptions;
using Application.Interfaces.Repositories.Base;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Location
{
    public class UpdateLocation : IRequest<Response<bool>> 
    {
        public int Id { get; set; }
        public string NumberRoom { get; set; }
        public int DepartmentId { get; set; }
    }

    public class UpdateLocationHandler : IRequestHandler<UpdateLocation, Response<bool>>
    {
        private readonly ILocationRepository _roleRepository;
        private readonly IMapper _mapper;

        public UpdateLocationHandler(ILocationRepository roleRepository, IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(UpdateLocation command, CancellationToken cancellationToken)
        {
            var role = await _roleRepository.GetByIdAsync(command.Id);

            if (role == null)
                throw new ApiException($"Местоположение с ИД \"{command.Id}\" не найдено.");

            role.NumberRoom = command.NumberRoom;
            role.DepartmentId = command.DepartmentId;

            await _roleRepository.UpdateAsync(role);

            return new Response<bool>(true);
        }
    }
}
