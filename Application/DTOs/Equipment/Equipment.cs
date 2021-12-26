using System;

namespace Application.DTOs.Equipment
{
    public class Equipment : BaseDto
    {
        public string Name { get; set; }
        public int? Number { get; set; }
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
        public int? TagId { get; set; }
        public int? InstructionId { get; set; }
    }
}
