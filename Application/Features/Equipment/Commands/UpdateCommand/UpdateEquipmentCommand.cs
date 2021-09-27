using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Equipment.Commands.UpdateCommand
{
    public class UpdateEquipmentCommand : IRequest<Response<int>> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public string PurposeOfUse { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public DateTime DateCreate { get; set; }
        public DateTime DateCommissioning { get; set; }
        public string InventoryNumber { get; set; }
        public string Description { get; set; }
        public int? ManufacturerId { get; set; }
        public int? DepartmentId { get; set; }
        public int? LocationId { get; set; }
        public int? TypeId { get; set; }
        public int? InstructionId { get; set; }
        public string FifNumber { get; set; }
        public string Accuracy { get; set; }
        public string ClassAccuracy { get; set; }
        public string MeasuringRange { get; set; }
        public string MeasuringWork { get; set; }
        public string Characteristics { get; set; }
    }

    public class UpdateEquipmentCommandHandler : IRequestHandler<UpdateEquipmentCommand, Response<int>>
    {
        private readonly IEquipmentRepositoryAsync _equipmentRepositoryAsync;
        private readonly IMapper _mapper;

        public UpdateEquipmentCommandHandler(IEquipmentRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _equipmentRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }
        public async Task<Response<int>> Handle(UpdateEquipmentCommand command, CancellationToken cancellationToken)
        {
            var equipment = await _equipmentRepositoryAsync.GetByIdAsync(command.Id);

            if (equipment == null)
                throw new ApiException($"Оборудование с ИД \"{command.Id}\" не найдено.");

            var equipmentCommand = _mapper.Map(command, equipment, command.GetType(), equipment.GetType());

            await _equipmentRepositoryAsync.UpdateAsync((Domain.Entities.Equipment.Equipment)equipmentCommand);

            return new Response<int>(equipment.Id);
        }
    }
}
