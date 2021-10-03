using Application.DTOs.Base;
using System;

namespace Application.DTOs.Equipment
{
    public class MovingDto : BaseDto
    {
        public int EquipmentId { get; set; }
        public int? CurrentDepartmentId { get; set; }
        public Department CurrentDepartment { get; set; }
        public int? NextDepartmentId { get; set; }
        public Department NextDepartment { get; set; }
        public int? CurrentLocationId { get; set; }
        public int? NextLocationId { get; set; }
        public DateTime? MovingDate { get; set; }
    }
}
