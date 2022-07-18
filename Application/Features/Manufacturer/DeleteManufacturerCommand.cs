using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Manufacturer
{
    public class DeleteManufacturerCommand : IRequest<Response<bool>>
    {

        public int Id { get; set; }
    }

    public class DeleteManufacturerCommandHandler : IRequestHandler<DeleteManufacturerCommand, Response<bool>>
    {
        private readonly IManufacturerRepository _equipmentRepositoryAsync;

        public DeleteManufacturerCommandHandler(IManufacturerRepository equipmentRepository)
        {
            _equipmentRepositoryAsync = equipmentRepository;
        }

        public async Task<Response<bool>> Handle(DeleteManufacturerCommand command, CancellationToken cancellationToken)
        {
            var verification = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (verification == null)
                throw new ApiException($"Производитель с ИД \"{command.Id}\" не найден.");

            await _equipmentRepositoryAsync.DeleteAsync(verification);

            return new Response<bool>(true);
        }
    }
}
