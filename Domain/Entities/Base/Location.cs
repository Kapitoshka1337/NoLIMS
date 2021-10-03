using Domain.Common;

namespace Domain.Entities.Base
{
    public class Location : BaseEntity
    {
        public string NumberRoom { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
    }
}
