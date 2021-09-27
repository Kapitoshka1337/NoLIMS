using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity.Models.Roles
{
    public class RoleClaim : IdentityRoleClaim<int>
    {
        public string Resource { get; set; }
    }
}
