using System.Collections.Generic;

namespace Application.Features.Role.WithPermission
{
    public class ViewModel
    {
        public string Role { get; set; }
        public IList<string> Permissions { get; set; }
    }
    public class PermisisonRole
    {
        public string Permission { get; set; }
    }
}
