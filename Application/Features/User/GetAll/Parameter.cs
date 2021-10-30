using Application.Filters;

namespace Application.Features.User.GetAll
{
    public class Parameter : RequestParameter 
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public int DepartmentId { get; set; }
    }
}
