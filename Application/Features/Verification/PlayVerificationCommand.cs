using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Verification
{

    public class EqVal
    {
        public int EquipmentId { get; set; }
    }

    public class PlayVerificationCommand : IRequest<Response<bool>>
    {
        public IList<EqVal> Equipments { get; set; }
    }

    public class PlayVerificationCommandHandler : IRequestHandler<PlayVerificationCommand, Response<bool>>
    {
        private readonly IVerificationRepositoryAsync _equipmentRepositoryAsync;
        private readonly IMapper _mapper;

        public PlayVerificationCommandHandler(IVerificationRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _equipmentRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(PlayVerificationCommand command, CancellationToken cancellationToken)
        {
            foreach (var eq in command.Equipments)
            {
                var verification = await _equipmentRepositoryAsync.GetByIdAsync(eq.EquipmentId);

                if (verification == null)
                    throw new ApiException($"Поверка с ИД \"{eq.EquipmentId}\" не найдена.");

                verification.StatusId = 2;

                await _equipmentRepositoryAsync.UpdateAsync(verification);
            }

            return new Response<bool>(true);
        }
    }
}
