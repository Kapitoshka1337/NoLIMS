using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DocumentKind
{
    public class DeleteDocumentKindCommand : IRequest<Response<bool>>
    {

        public int Id { get; set; }
    }

    public class DeleteDocumentKindCommandHandler : IRequestHandler<DeleteDocumentKindCommand, Response<bool>>
    {
        private readonly IDocumentKindRepository _equipmentRepositoryAsync;

        public DeleteDocumentKindCommandHandler(IDocumentKindRepository equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }

        public async Task<Response<bool>> Handle(DeleteDocumentKindCommand command, CancellationToken cancellationToken)
        {
            var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (verification == null)
                throw new ApiException($"Вид документа с ИД \"{command.Id}\" не найден.");

            await _equipmentRepositoryAsync.DeleteAsync(verification);

            return new Response<bool>(true);
        }
    }
}
