using Domain.Common;
using System;

namespace Domain.Entities.Equipment.Verification
{
    public class Verification : BaseEntity
    {
        public int EquipmentId { get; set; }
        public Equipment Equipment { get; set; }
        public int StatusId { get; set; }
        public VerificationStatus Status { get; set; }
    }
}
