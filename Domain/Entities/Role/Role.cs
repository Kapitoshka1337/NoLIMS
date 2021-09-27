using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Role
{
    public class Role : IdentityRole<int>
    {
        public Role(string Name) : base(Name) {}
        public Role(string Name, bool isSystem)
        {
            this.Name = Name;
            IsSystem = isSystem;
        }
        public bool IsSystem { get; set; }

        //public virtual ICollection<RolePermission> RolePermissions { get; set; }
        //public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
