using System;
using System.Collections.Generic;
using Application.DTOs.Base;
using Application.DTOs.Equipment;

namespace Application.Features.Equipment.Queries.GetAllEquipment
{
    public class GetAllEquipmentViewModel
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
        public string Manufacturer { get; set; }
        public string Department { get; set; }
        public Location Location { get; set; }
        public string Type { get; set; }
        //public DTOs.Equipment.Instruction Instruction { get; set; }
        public virtual IEnumerable<Status> Status { get; set; }
        //public virtual CheckDto Checks { get; set; }
    }
}
