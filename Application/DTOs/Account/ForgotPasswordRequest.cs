using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Account
{
    public class ForgotPasswordRequest
    {
        [Required]
        public string UserName { get; set; }
    }
}
