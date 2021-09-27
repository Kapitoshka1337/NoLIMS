using Domain.Common;

namespace Domain.Entities.Base
{
    public class Location : BaseEntity
    {
        public string Name { get; set; }
        public string NumberRoom { get; set; }
        public string Notation { get; set; }
        public string Storage { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
    }
}
