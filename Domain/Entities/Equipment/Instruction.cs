using Domain.Common;
using Domain.Entities.Storage;

namespace Domain.Entities.Equipment
{
    public class Instruction : AuditableBaseEntity
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public int FileId { get; set; }
        public File File { get; set; }
    }
}
