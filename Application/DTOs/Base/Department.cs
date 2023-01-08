namespace Application.DTOs.Base
{
    public class Department : BaseDto
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public int HeadDepartmentId { get; set; }
    }
}
