using Domain.Common;

namespace Domain.Entities.Equipment
{
    public class EquipmentStatus : BaseEntity
    {
        public int EquipmentId { get; set; }
        public Equipment Equipment { get; set; }
        public int TagId { get; set; }
        public Tags Tag { get; set; }
        public bool Value { get; set; }
    }
}
