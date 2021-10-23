﻿using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Account
{
    public class RegisterRequest
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string MiddleName { get; set; }

        [Required]
        public string LastName { get; set; }

        //[Required]
        //[EmailAddress]
        //public string Email { get; set; }
        [Required]
        [MinLength(3)]
        public string UserName { get; set; }

        [Required]
        [MinLength(3)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        [Required]
        public int DepartmentId { get; set; }
    }
}
