using Application.Interfaces;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Equipment.Commands
{
    public class CreateCI : IRequest<Response<int>>
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
        public string FifNumber { get; set; }
        public string Accuracy { get; set; }
        public string ClassAccuracy { get; set; }
        public string MeasuringRange { get; set; }
        public int TagId { get; set; }
    }

    public class CreateCIHandler : IRequestHandler<CreateCI, Response<int>>
    {
        private readonly IGenericRepositoryAsync<Domain.Entities.Equipment.EquipmentCI> _genericRepositoryAsync;
        private readonly IMapper _mapper;
        public CreateCIHandler(IGenericRepositoryAsync<Domain.Entities.Equipment.EquipmentCI> equipmentRepository, IMapper mapper)
        {
            _genericRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(CreateCI request, CancellationToken cancellationToken)
        {
            var equipmentDto = _mapper.Map<DTOs.Equipment.EquipmentCI>(request);
            var equipmentBase = _mapper.Map<Domain.Entities.Equipment.EquipmentCI>(equipmentDto);
            await _genericRepositoryAsync.AddAsync(equipmentBase);

            return new Response<int>(equipmentBase.Id);
        }
    }
}
