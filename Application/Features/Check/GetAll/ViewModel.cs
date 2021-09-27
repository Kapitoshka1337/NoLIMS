namespace Application.Features.Check.GetAll
{
    public class ViewModel : DTOs.Equipment.CheckDto
    {
        public int Id { get; set; }
        public EqViewModel Equipment { get; set; }
    }
}
