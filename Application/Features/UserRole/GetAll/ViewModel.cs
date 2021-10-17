namespace Application.Features.UserRole.GetAll
{
    public class ViewModel : DTOs.Role.RoleDto
    {
        public bool IsGranted { get; set; }
    }
}
