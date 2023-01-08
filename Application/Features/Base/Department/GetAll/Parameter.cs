using Application.Filters;

namespace Application.Features.Base.Department.GetAll
{
    public class Parameter : RequestParameter
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public int? HeadDepartmentId { get; set; }
    }
}
