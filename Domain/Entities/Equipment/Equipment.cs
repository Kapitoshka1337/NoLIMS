using Domain.Common;
using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Equipment
{
    public class Equipment : AuditableBaseEntity
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public string PurposeOfUse { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? DateCreate { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? DateCommissioning { get; set; }
        public string InventoryNumber { get; set; }
        public string Description { get; set; }
        public int? ManufacturerId { get; set; }
        public Manufacturer Manufacturer { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public int? LocationId { get; set; }
        public Location Location { get; set; }
        public int TypeId { get; set; }
        public Type Type { get; set; }
        public int? TagId { get; set; }
        public Tags Tag { get; set; }
        public virtual IEnumerable<Check> Checks { get; set; }
        public virtual IEnumerable<Moving> Movings { get; set; }
        // СИ ФИФ.
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
