using Infrastructure.Identity.Models.Permission;
using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Identity.Models.Roles
{
    public class RolePermission
    {
        [Key]
        public int Id { get; set; }
        public int RoleId { get; set; }

        public virtual Role Role { get; set; }

        public int PermissionId { get; set; }

        public virtual Permissions Permission { get; set; }
    }
}
