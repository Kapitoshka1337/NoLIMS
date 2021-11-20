using Application.Exceptions;
using Application.Interfaces.Repositories.Base;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Department
{
    public class UpdateDepartment : IRequest<Response<bool>> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
    }

    public class UpdateDepartmentHandler : IRequestHandler<UpdateDepartment, Response<bool>>
    {
        private readonly IDepartmentRepository _roleRepository;
        private readonly IMapper _mapper;

        public UpdateDepartmentHandler(IDepartmentRepository roleRepository, IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(UpdateDepartment command, CancellationToken cancellationToken)
        {
            var role = await _roleRepository.GetByIdAsync(command.Id);

            if (role == null)
                throw new ApiException($"Подразделение с ИД \"{command.Id}\" не найдено.");

            role.Name = command.Name;
            role.Number = command.Number;

            await _roleRepository.UpdateAsync(role);

            return new Response<bool>(true);
        }
    }
}
