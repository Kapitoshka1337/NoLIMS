namespace Application.DTOs.Role
{
    public class UserRoleUpdateRequest
    {
        public int UserId { get; set; }
        public int NewRoleId { get; set; }
        public int OldRoleId { get; set; }
    }
}
