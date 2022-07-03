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
        public IList<EqVal> Verifications { get; set; }
    }

    public class PlayVerificationCommandHandler : IRequestHandler<PlayVerificationCommand, Response<bool>>
    {
        private readonly IVerificationRepositoryAsync _verificationRepository;
        private readonly IEquipmentRepositoryAsync _equipmentRepository;
        private readonly IMapper _mapper;

        public PlayVerificationCommandHandler(IVerificationRepositoryAsync verificationRepository, IEquipmentRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _verificationRepository = verificationRepository;
            _equipmentRepository = equipmentRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(PlayVerificationCommand command, CancellationToken cancellationToken)
        {
            foreach (var eq in command.Verifications)
            {
                var verification = await _verificationRepository.GetByIdAsync(eq.EquipmentId);

                if (verification == null)
                {
                    string msg = $"Поверка с ИД \"{eq.EquipmentId}\" не найдена.";

                    Response<bool> rsp = new Response<bool>();
                    rsp.Succeeded = false;
                    rsp.Message = msg;
                    rsp.Data = false;

                    return rsp;
                }

                verification.StatusId = 2;
                var equipment = await _equipmentRepository.GetByIdAsync(verification.EquipmentId);
                equipment.TagId = 5;

                await _equipmentRepository.UpdateAsync(equipment);
                await _verificationRepository.UpdateAsync(verification);
            }

            return new Response<bool>(true);
        }
    }
}
