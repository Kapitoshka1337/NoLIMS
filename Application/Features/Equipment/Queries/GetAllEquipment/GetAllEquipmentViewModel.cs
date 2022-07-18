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
        public string FifNumber { get; set; }
        public DateTime DateCreate { get; set; }
        public DateTime DateCommissioning { get; set; }
        public string InventoryNumber { get; set; }
        public string Description { get; set; }
        public Application.DTOs.Equipment.Manufacturer Manufacturer { get; set; }
        public Department Department { get; set; }
        public int? LocationId { get; set; }
        public Location Location { get; set; }
        public Application.DTOs.Equipment.Type Type { get; set; }
        public TagsDto Tag { get; set; }
        //public virtual IEnumerable<MovingDto> Movings { get; set; }
    }
}
