using Application.Interfaces;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Equipment.Commands.CreateEquipment
{
    public class CreateEquipmentCommand : IRequest<Response<int>>
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public string PurposeOfUse { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public DateTime DateCreate { get; set; }
        public DateTime DateCommissioning { get; set; }
        public string InventoryNumber { get; set; }
        public string Description { get; set; }
        public int ManufacturerId { get; set; }
        public int DepartmentId { get; set; }
        public int LocationId { get; set; }
        public int TypeId { get; set; }
        public int InstructionId { get; set; }
    }

    public class CreateEquipmentCommandHandler : IRequestHandler<CreateEquipmentCommand, Response<int>>
    {
        private readonly IGenericRepositoryAsync<Domain.Entities.Equipment.Equipment> _genericRepositoryAsync;
        private readonly IMapper _mapper;
        public CreateEquipmentCommandHandler(IGenericRepositoryAsync<Domain.Entities.Equipment.Equipment> equipmentRepository, IMapper mapper)
        {
            _genericRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(CreateEquipmentCommand request, CancellationToken cancellationToken)
        {
            var equipmentDto = _mapper.Map<DTOs.Equipment.Equipment>(request);
            var equipmentBase = _mapper.Map<Domain.Entities.Equipment.Equipment>(equipmentDto);
            try
            {
                await _genericRepositoryAsync.AddAsync(equipmentBase);
            }
            catch (Exception ex)
            {

            }
            
            return new Response<int>(equipmentBase.Id);
        }
    }
}
