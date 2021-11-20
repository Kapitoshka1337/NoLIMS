using Application.Filters;

namespace Application.Features.Base.Location.GetAll
{
    public class Parameter : RequestParameter
    {
        public string NumberRoom { get; set; }
        public int? DepartmentId { get; set; }
    }
}
