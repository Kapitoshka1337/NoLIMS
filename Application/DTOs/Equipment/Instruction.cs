using Domain.Common;

namespace Application.DTOs.Equipment
{
    public class Instruction : BaseDto
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public int FileId { get; set; }
    }
}
