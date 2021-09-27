using Application.DTOs.Equipment.Verification;
using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Verification
{
    public class UpdateVerificationCommand : VerificationDto, IRequest<Response<int>> {}

    public class UpdateEquipmentCommandHandler : IRequestHandler<UpdateVerificationCommand, Response<int>>
    {
        private readonly IVerificationRepositoryAsync _equipmentRepositoryAsync;
        private readonly IMapper _mapper;

        public UpdateEquipmentCommandHandler(IVerificationRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _equipmentRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }
        public async Task<Response<int>> Handle(UpdateVerificationCommand command, CancellationToken cancellationToken)
        {
            var equipment = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (equipment == null)
                throw new ApiException($"Поверка с ИД \"{command.Id}\" не найдена.");

            var equipmentCommand = _mapper.Map<Domain.Entities.Equipment.Verification.Verification>(command);
            equipment = equipmentCommand;
            await _equipmentRepositoryAsync.UpdateAsync(equipment);

            return new Response<int>(equipment.Id);
        }
    }
}
