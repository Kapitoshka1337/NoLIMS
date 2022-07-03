using Domain.Common;
using Domain.Entities.Storage;
using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Equipment
{
    public class Check : BaseEntity
    {
        public string NumberDocument { get; set; }
        public DateTime? CurrentCheck { get; set; }
        public DateTime? NextCheck { get; set; }

        public int? FileId { get; set; }
        public File File { get; set; }

        public int? DocumentKindId { get; set; }
        public DocumentKind DocumentKind { get; set; }

        public int EquipmentId { get; set; }
        public Equipment Equipment { get; set; }
    }
}
