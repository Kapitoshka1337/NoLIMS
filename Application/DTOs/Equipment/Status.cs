namespace Application.DTOs.Equipment
{
    public class Status : BaseDto
    {
        public int EquipmentId { get; set; }
        public int TagId { get; set; }
        public TagsDto Tag { get; set; }
        public bool Value { get; set; }
    }
}
