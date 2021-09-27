using System;

namespace Application.Features.Check.GetAll
{
    public class EqViewModel
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
        public string Type { get; set; }
    }
}
