namespace Application.DTOs.Role
{
    public class RoleClaimDto
    {
        public int? Id { get; set; }
        public int RoleId { get; set; }
        public string Resource { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
    }
}
