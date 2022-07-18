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
        public int Id { get; set; }
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
            var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);
            
            if (verification == null)
                throw new ApiException($"Поверка с ИД \"{command.Id}\" не найдена.");

            await _equipmentRepositoryAsync.DeleteAsync(verification);

            return new Response<bool>(true);
        }
    }
}
