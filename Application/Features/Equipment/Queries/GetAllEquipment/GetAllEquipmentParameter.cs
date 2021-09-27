using Application.DTOs.Equipment;
using Application.Filters;
using System;
using System.Collections.Generic;

namespace Application.Features.Equipment.Queries.GetAllEquipment
{
    public class GetAllEquipmentParameter : RequestParameter
    {
        public int? Id { get; set; }
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
        //public DTOs.Equipment.Instruction Instruction { get; set; }
        public virtual IEnumerable<Status> Status { get; set; }
        //public virtual CheckDto Checks { get; set; }
    }
}
