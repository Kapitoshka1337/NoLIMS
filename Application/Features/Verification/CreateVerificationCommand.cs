using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Verification
{
    public class CreateVerificationCommand : IRequest<Response<bool>>
    {
        public  IList<EqVal> Verifications { get; set; }
    }

    public class CreateVerificationCommandHandler : IRequestHandler<CreateVerificationCommand, Response<bool>>
    {
        private readonly IVerificationRepositoryAsync _genericRepositoryAsync;
        private readonly IMapper _mapper;
        public CreateVerificationCommandHandler(IVerificationRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _genericRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<Response<bool>> Handle(CreateVerificationCommand request, CancellationToken cancellationToken)
        {
            foreach (var eq in request.Verifications)
            {
                var verificationDto = _mapper.Map<DTOs.Equipment.Verification.VerificationDto>(eq);
                var verificationBase = _mapper.Map<Domain.Entities.Equipment.Verification.Verification>(verificationDto);

                verificationBase.StatusId = 1;

                await _genericRepositoryAsync.AddAsync(verificationBase);
            }

            return new Response<bool>(true);
        }
    }
}
