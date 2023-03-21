using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.DTOs.Permission;
using Application.Features.Role.WithPermission;

namespace Application.DTOs.Account
{
    public class AuthenticationResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public IList<string> Permissions { get; set; }
        public IList<string> Roles { get; set; }
        public IList<ModuleClaimViewModel> Claims { get; set; }
        public string JWToken { get; set; }
        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}
