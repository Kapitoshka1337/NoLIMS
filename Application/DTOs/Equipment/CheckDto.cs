using System;

namespace Application.DTOs.Equipment
{
    public class CheckDto: BaseDto
    {
        public string NumberDocument { get; set; }
        public DateTime? CurrentCheck { get; set; }
        public DateTime? NextCheck { get; set; }
        public int EquipmentId { get; set; }
        public Equipment Equipment { get; set; }
        public int DocumentKindId { get; set; }
        public DocumentKindDto DocumentKind { get; set; }
        public int? FileId { get; set; }
    }
}
