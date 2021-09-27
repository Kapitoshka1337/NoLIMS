using Application.DTOs.Permission;
using System.Collections.Generic;

namespace Application.DTOs.Permission
{
    public class PermissionViewModel
    {
        public string RoleId { get; set; }
        public IList<RoleClaimsViewModel> Claims { get; set; }
    }
}
