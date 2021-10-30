using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Account
{
    public class ResetPasswordRequest
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        [MinLength(3)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
