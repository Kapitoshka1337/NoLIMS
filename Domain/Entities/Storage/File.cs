using Domain.Common;

namespace Domain.Entities.Storage
{
    public class File : BaseEntity
    {
        public string Hash { get; set; }
        public string Type { get; set; }
        public decimal Size { get; set; }
    }
}
