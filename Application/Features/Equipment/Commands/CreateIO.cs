using Application.Interfaces;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Equipment.Commands
{
    public class CreateIO : IRequest<Response<int>>
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public string PurposeOfUse { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public DateTime? DateCreate { get; set; }
        public DateTime? DateCommissioning { get; set; }
        public string InventoryNumber { get; set; }
        public string Description { get; set; }
        public int? ManufacturerId { get; set; }
        public int DepartmentId { get; set; }
        public int? LocationId { get; set; }
        public int TypeId { get; set; }
        public int? InstructionId { get; set; }
        public string Accuracy { get; set; }
        public string MeasuringWork { get; set; }
    }

    public class CreateIOHandler : IRequestHandler<CreateIO, Response<int>>
    {
        private readonly IGenericRepositoryAsync<Domain.Entities.Equipment.EquipmentIO> _genericRepositoryAsync;
        private readonly IMapper _mapper;
        public CreateIOHandler(IGenericRepositoryAsync<Domain.Entities.Equipment.EquipmentIO> equipmentRepository, IMapper mapper)
        {
            _genericRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(CreateIO request, CancellationToken cancellationToken)
        {
            var equipmentDto = _mapper.Map<DTOs.Equipment.EquipmentIO>(request);
            var equipmentBase = _mapper.Map<Domain.Entities.Equipment.EquipmentIO>(equipmentDto);
            await _genericRepositoryAsync.AddAsync(equipmentBase);

            return new Response<int>(equipmentBase.Id);
        }
    }
}
