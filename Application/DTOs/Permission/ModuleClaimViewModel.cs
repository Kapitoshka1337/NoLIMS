using System.Collections.Generic;

namespace Application.DTOs.Permission
{
    public class ModuleClaimViewModel
    {
        public string Module { get; set; }

        public IDictionary<string, bool> Permissions { get; set; }
    }
}
