using Application.Exceptions;
using Application.Interfaces.Repositories.Base;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Department
{
    public class DeleteDepartmentCommand : IRequest<Response<bool>>
    {

        public int Id { get; set; }
    }

    public class DeleteDepartmentCommandHandler : IRequestHandler<DeleteDepartmentCommand, Response<bool>>
    {
        private readonly IDepartmentRepository _equipmentRepositoryAsync;

        public DeleteDepartmentCommandHandler(IDepartmentRepository equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }

        public async Task<Response<bool>> Handle(DeleteDepartmentCommand command, CancellationToken cancellationToken)
        {
            var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (verification == null)
                throw new ApiException($"Подразделение с ИД \"{command.Id}\" не найдено.");

            await _equipmentRepositoryAsync.DeleteAsync(verification);

            return new Response<bool>(true);
        }
    }
}
