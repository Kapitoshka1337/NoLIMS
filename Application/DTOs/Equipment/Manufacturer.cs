using Domain.Common;

namespace Application.DTOs.Equipment
{
    public class Manufacturer : BaseDto
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }
}
