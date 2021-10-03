using Domain.Common;
using Domain.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Equipment
{
    public class Moving : BaseEntity
    {
        public int EquipmentId { get; set; }
        public int CurrentDepartmentId { get; set; }

        [ForeignKey("CurrentDepartmentId")]
        public Department CurrentDepartment { get; set; }
        public int NextDepartmentId { get; set; }

        [ForeignKey("NextDepartmentId")]
        public Department NextDepartment { get; set; }
        public int? CurrentLocationId { get; set; }
        public int? NextLocationId { get; set; }
        public DateTime? MovingDate { get; set; }
    }
}
