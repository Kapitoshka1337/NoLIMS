using Domain.Common;
using System.Collections.Generic;

namespace Domain.Entities.Base
{
    public class BusinessUnit : BaseEntity
    {
        public string Name { get; set; }
        public IList<Department> Departments { get; set; }
    }
}
