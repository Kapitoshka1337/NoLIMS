using Application.Exceptions;
using Application.Interfaces.Repositories.Base;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Location
{
    public class DeleteLocationCommand : IRequest<Response<bool>>
    {
        public int Id { get; set; }
    }

    public class DeleteLocationCommandHandler : IRequestHandler<DeleteLocationCommand, Response<bool>>
    {
        private readonly ILocationRepository _equipmentRepositoryAsync;

        public DeleteLocationCommandHandler(ILocationRepository equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }

        public async Task<Response<bool>> Handle(DeleteLocationCommand command, CancellationToken cancellationToken)
        {
            var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (verification == null)
                throw new ApiException($"Местоположение с ИД \"{command.Id}\" не найдено.");

            await _equipmentRepositoryAsync.DeleteAsync(verification);

            return new Response<bool>(true);
        }
    }
}
