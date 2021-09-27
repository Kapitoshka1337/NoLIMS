using Infrastructure.Identity.Models.Roles;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Identity.Models.Permission
{
    public class Permissions
    {
        [Key]
        public int PermissionId { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public virtual ICollection<RolePermission> RolePermissions { get; set; }
    }
}
