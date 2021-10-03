using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using Application.DTOs.Equipment;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Application.Features.Equipment.Queries.GetEquipmentById
{
    public class EquipmentDetail
    {
        public int Id { get; set; }
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
        public int? DepartmentId { get; set; }
        //public Location Location { get; set; }
        public int? TypeId { get; set; }
        public virtual IEnumerable<Status> Status { get; set; }
        public virtual IEnumerable<CheckDto> Checks { get; set; }
        public virtual IEnumerable<MovingDto> Movings { get; set; }

        public string FifNumber { get; set; }
        // СИ Точность.
        public string Accuracy { get; set; }
        // СИ Класс точности.
        public string ClassAccuracy { get; set; }
        // СИ Диапазон измерений.
        public string MeasuringRange { get; set; }

        // ИО Диапазон работы.
        public string MeasuringWork { get; set; }

        public string Characteristics { get; set; }
    }

    public class GetEquipmentByIdQuery : IRequest<Response<EquipmentDetail>>
    {
        public int Id { get; set; }
    }

    public class GetProductByIdQueryHandler : IRequestHandler<GetEquipmentByIdQuery, Response<EquipmentDetail>>
    {
        private readonly IEquipmentRepositoryAsync _equipmentRepositoryAsync;
        private readonly IMapper _mapper;

        public GetProductByIdQueryHandler(IEquipmentRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _equipmentRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }
        public async Task<Response<EquipmentDetail>> Handle(GetEquipmentByIdQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _equipmentRepositoryAsync.GetByIdAsync(query.Id);

            if (equipment == null)
                throw new ApiException($"Оборудование с ИД \"{query.Id}\" не найдено.");

            var equipmentViewModel = _mapper.Map<EquipmentDetail>(equipment);

            return new Response<EquipmentDetail>(equipmentViewModel);
        }
    }
}
