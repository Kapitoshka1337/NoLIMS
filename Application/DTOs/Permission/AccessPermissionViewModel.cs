using System.Collections.Generic;

namespace Application.DTOs.Permission
{
    public class AccessPermissionViewModel
    {
        public IList<AccessRoleClaimsViewModel> Claims { get; set; }
    }
}
