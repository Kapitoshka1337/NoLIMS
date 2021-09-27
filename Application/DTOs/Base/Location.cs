namespace Application.DTOs.Base
{
    public class Location : BaseDto
    {
        public string Name { get; set; }
        public string NumberRoom { get; set; }
        public string Notation { get; set; }
        public string Storage { get; set; }
        public int DepartmentId { get; set; }
    }
}
