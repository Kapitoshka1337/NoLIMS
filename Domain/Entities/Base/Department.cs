using Domain.Common;

namespace Domain.Entities.Base
{
    public class Department : BaseEntity
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public BusinessUnit BusinessUnit { get; set; }
        public Department HeadDepartment { get; set; }
        public int? HeadDepartmentId { get; set; }
    }
}
