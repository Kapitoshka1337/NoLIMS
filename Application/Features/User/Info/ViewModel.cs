using System.Collections.Generic;
using Application.DTOs.Permission;

namespace Application.Features.User.Info
{
    public class ViewModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public IList<ModuleClaimViewModel> Claims { get; set; }
        public IList<string> Roles { get; set; }
        public IList<string> Permissions { get; set; }
    }
}
