using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Check
{
    public class DeleteCheckCommand : IRequest<Response<bool>>
    {
        //public IList<int> CheckId { get; set; }
        public int Id { get; set; }
    }

    public class DeleteCheckCommandHandler : IRequestHandler<DeleteCheckCommand, Response<bool>>
    {
        private readonly ICheckRepository _equipmentRepositoryAsync;
        public DeleteCheckCommandHandler(ICheckRepository equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }

        public async Task<Response<bool>> Handle(DeleteCheckCommand command, CancellationToken cancellationToken)
        {
            //foreach (var eq in command.CheckId)
            //{
                var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

                if (verification == null)
                    throw new ApiException($"Поверка с ИД \"{command.Id}\" не найдена.");

                await _equipmentRepositoryAsync.DeleteAsync(verification);
            //}

            return new Response<bool>(true);
        }
    }
}
