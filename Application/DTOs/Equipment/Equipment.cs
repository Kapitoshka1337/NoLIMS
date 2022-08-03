using System;
using Application.DTOs.Base;

namespace Application.DTOs.Equipment
{
    public class Equipment : BaseDto
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
        public Department Department { get; set; }
        public int? LocationId { get; set; }
        public int TypeId { get; set; }
        public Type Type { get; set; }
        public int TagId { get; set; }
        public TagsDto Tag { get; set; }
        public int? InstructionId { get; set; }
        public string FifNumber { get; set; }

        // ИО/СИ Точность.
        public string Accuracy { get; set; }

        // СИ Класс точности.
        public string ClassAccuracy { get; set; }

        // СИ Диапазон измерений.
        public string MeasuringRange { get; set; }

        // ИО Диапазон работы.
        public string MeasuringWork { get; set; }

        // ВО Характеристики.
        public string Characteristics { get; set; }
    }
}
