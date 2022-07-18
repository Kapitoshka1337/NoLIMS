using Application.Exceptions;
using Application.Interfaces.Repositories.Instruction;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Instruction
{
    public class DeleteInstructionCommand : IRequest<Response<bool>>
    {

        public int Id { get; set; }
    }

    public class DeleteInstructionCommandHandler : IRequestHandler<DeleteInstructionCommand, Response<bool>>
    {
        private readonly IInstructionRepository _equipmentRepositoryAsync;

        public DeleteInstructionCommandHandler(IInstructionRepository equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }

        public async Task<Response<bool>> Handle(DeleteInstructionCommand command, CancellationToken cancellationToken)
        {
            var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (verification == null)
                throw new ApiException($"Инструкция с ИД \"{command.Id}\" не найдена.");

            await _equipmentRepositoryAsync.DeleteAsync(verification);

            return new Response<bool>(true);
        }
    }
}
