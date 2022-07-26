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
    public class Ver
    {
        public int VerificationId { get; set; }
    }

    public class ResetCommand : IRequest<Response<bool>> 
    {
        public IList<Ver> Verifications { get; set; }
    }

    public class ResetCommandHandler : IRequestHandler<ResetCommand, Response<bool>>
    {
        private readonly IVerificationRepositoryAsync _verificationRepository;
        private readonly IEquipmentRepositoryAsync _equipmentRepository;
        private readonly IMapper _mapper;

        public ResetCommandHandler(IVerificationRepositoryAsync verificationRepository, IEquipmentRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _verificationRepository = verificationRepository;
            _equipmentRepository = equipmentRepository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(ResetCommand command, CancellationToken cancellationToken)
        {
            foreach (var eq in command.Verifications)
            {
                var verification = await _verificationRepository.GetByIdAsync(eq.VerificationId);

                if (verification == null)
                {
                    string msg = $"Поверка с ИД \"{eq.VerificationId}\" не найдена.";

                    Response<bool> rsp = new Response<bool>();
                    rsp.Succeeded = false;
                    rsp.Message = msg;
                    rsp.Data = false;

                    return rsp;
                }

                verification.StatusId = 1;
                var equipment = await _equipmentRepository.GetByIdAsync(verification.EquipmentId);
                equipment.TagId = 2;

                await _equipmentRepository.UpdateAsync(equipment);
                await _verificationRepository.UpdateAsync(verification);
            }

            return new Response<bool>(true);
        }
    }
}
