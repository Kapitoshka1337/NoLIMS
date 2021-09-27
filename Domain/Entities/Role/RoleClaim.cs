using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Role
{
    public class RoleClaim : IdentityRoleClaim<int>
    {
        public string Resource { get; set; }
    }
}
