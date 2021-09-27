using Domain.Common;

namespace Domain.Entities.Equipment
{
    public class Manufacturer : BaseEntity
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }
}
