using Domain.Common;

namespace Domain.Entities.Equipment
{
    public class Status : BaseEntity
    {
        public string Name { get; set; }
        public Equipment Equipment { get; set; }
        public string Value { get; set; }
    }
}
