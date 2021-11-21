using Application.Filters;
using System;

namespace Application.Features.Check.GetAll
{
    public class Parameter : RequestParameter
    {
        public string NumberDocument { get; set; }
        
        public DateTime? CurrentCheckStart { get; set; }
        public DateTime? CurrentCheckEnd { get; set; }
        public DateTime? NextCheckStart { get; set; }
        public DateTime? NextCheckEnd { get; set; }
        public int EquipmentId { get; set; }
        public int? DocumentKindId { get; set; }
        public int? DepartmentId { get; set; }
        public int? TypeId { get; set; }
        public string EquipmentName { get; set; }
        public string EquipmentModel { get; set; }
        public string EquipmentSerialNumber { get; set; }
    }
}
