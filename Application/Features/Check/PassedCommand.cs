using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Check
{
    public class PassedCommand : IRequest<Response<int>>
    {
        public string NumberDocument { get; set; }
        public DateTime? CurrentCheck { get; set; }
        public DateTime? NextCheck { get; set; }
        public int EquipmentId { get; set; }
        public int? DocumentKindId { get; set; }
        public int? FileId { get; set; }
    }

    public class PassedCommandHandler : IRequestHandler<PassedCommand, Response<int>>
    {
        private readonly ICheckRepository _checkRepository;
        private readonly IVerificationRepositoryAsync _verificationRepository;
        private readonly IEquipmentRepositoryAsync _equipmentRepository;
        private readonly IMapper _mapper;

        public PassedCommandHandler(ICheckRepository checkRepository, IVerificationRepositoryAsync verificationRepository, IEquipmentRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _checkRepository = checkRepository;
            _verificationRepository = verificationRepository;
            _equipmentRepository = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(PassedCommand command, CancellationToken cancellationToken)
        {
            var verification = await _verificationRepository.GetAllAsync();
            // Оборудование на поверке.
            var eqver = verification.Where(v => v.EquipmentId == command.EquipmentId && v.StatusId == 2);

            if (!eqver.Any())
            {
                string msg = $"Не найдено оборудование с ИД \"{command.EquipmentId}\" и статусом 'На поверке'.";
                Response<int> rsp = new Response<int>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            var equipment = await _equipmentRepository.GetByIdAsync(command.EquipmentId);
            equipment.TagId = 2;

            var ver = eqver.First();
            ver.StatusId = 3;

            var mapCheck = _mapper.Map<Domain.Entities.Equipment.Check>(command);
            Domain.Entities.Equipment.Check addedCheck = null;

            // Добавление поверки и обновление состояние.
            await _equipmentRepository.UpdateAsync(equipment);
            addedCheck = await _checkRepository.AddAsync(mapCheck);
            await _verificationRepository.UpdateAsync(ver);

            return new Response<int>(addedCheck.Id);
        }
    }
}
