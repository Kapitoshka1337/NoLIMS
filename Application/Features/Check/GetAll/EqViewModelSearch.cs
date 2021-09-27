using System;

namespace Application.Features.Check.GetAll
{
    public class EqViewModelSearch
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public string InventoryNumber { get; set; }
        public int ManufacturerId { get; set; }
        public int DepartmentId { get; set; }
        public int TypeId { get; set; }
    }
}
