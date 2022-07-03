using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Verification
{
    public class DeleteVerificationCommand : IRequest<Response<bool>>
    {
        public IList<EqVal> Verifications { get; set; }
    }

    public class DeleteVerificationCommandHandler : IRequestHandler<DeleteVerificationCommand, Response<bool>>
    {
        private readonly IVerificationRepositoryAsync _equipmentRepositoryAsync;
        public DeleteVerificationCommandHandler(IVerificationRepositoryAsync equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }
        public async Task<Response<bool>> Handle(DeleteVerificationCommand command, CancellationToken cancellationToken)
        {
            foreach (var eq in command.Verifications)
            {
                var verification = await _equipmentRepositoryAsync.GetByIdAsync(eq.EquipmentId);
            
                if (verification == null)
                    throw new ApiException($"Поверка с ИД \"{eq.EquipmentId}\" не найдена.");

                await _equipmentRepositoryAsync.DeleteAsync(verification);
            }

            return new Response<bool>(true);
        }
    }
}
