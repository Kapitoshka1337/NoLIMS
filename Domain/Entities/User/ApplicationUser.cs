using Domain.Entities.Base;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Domain.Entities.User
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public int? DepartmentId { get; set; }
        public Department Department { get; set; }
        //public List<RefreshToken> RefreshTokens { get; set; }

        //public bool OwnsToken(string token)
        //{
        //    return this.RefreshTokens?.Find(x => x.Token == token) != null;
        //}
    }
}
