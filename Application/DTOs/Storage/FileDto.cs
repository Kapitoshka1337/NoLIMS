namespace Application.DTOs.Storage
{
    public class FileDto : BaseDto
    {
        public string Hash { get; set; }
        public string Type { get; set; }
        public decimal Size { get; set; }
    }
}
