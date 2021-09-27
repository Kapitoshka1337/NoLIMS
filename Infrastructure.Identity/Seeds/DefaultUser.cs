using Application.Enums;
using Infrastructure.Identity.Models.Roles;
using Infrastructure.Identity.Models.User;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Identity.Seeds
{
    public static class DefaultUser
    {
        public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager)
        {
            var defaultUser = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@mail.com",
                FirstName = "admin",
                LastName = "admin",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true
            };

            if (userManager.Users.All(u => u.Id != defaultUser.Id))
            {
                var user = await userManager.FindByEmailAsync(defaultUser.Email);

                if (user == null)
                {
                    await userManager.CreateAsync(defaultUser, "123Pa$$word!");
                    await userManager.AddToRoleAsync(defaultUser, Roles.Admin.ToString());
                }

            }
        }
    }
}
