using Application.DTOs.Permission;
using System.Collections.Generic;

namespace Application.DTOs.User
{
    public class UserPermissionResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public IList<ModuleClaimViewModel> Claims { get; set; }
    }
}