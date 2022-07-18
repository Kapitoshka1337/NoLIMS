using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Equipment.Commands
{
    public class DeleteEquipmentCommand : IRequest<Response<bool>>
    {

        public int Id { get; set; }
    }

    public class DeleteEquipmentCommandHandler : IRequestHandler<DeleteEquipmentCommand, Response<bool>>
    {
        private readonly IEquipmentRepositoryAsync _equipmentRepositoryAsync;

        public DeleteEquipmentCommandHandler(IEquipmentRepositoryAsync equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }

        public async Task<Response<bool>> Handle(DeleteEquipmentCommand command, CancellationToken cancellationToken)
        {
            var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (verification == null)
                throw new ApiException($"Оборудование с ИД \"{command.Id}\" не найдено.");

            await _equipmentRepositoryAsync.DeleteAsync(verification);

            return new Response<bool>(true);
        }
    }
}
