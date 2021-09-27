using Domain.Entities.Base;
using Infrastructure.Identity.Models.Roles;
using Infrastructure.Identity.Models.User;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity.Contexts
{
    public class IdentityContext : IdentityDbContext<ApplicationUser, Role, int, UserClaim, UserRole, UserLogin, RoleClaim, UserToken>
    {
        public IdentityContext(DbContextOptions<IdentityContext> options) : base(options) {}
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //builder.HasDefaultSchema("Identity");
            builder.Entity<BusinessUnit>(entity =>
            {
                entity.ToTable("BusinessUnits");
            });

            builder.Entity<Department>(entity =>
            {
                entity.ToTable("Departments");
            });

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.ToTable("User");
            });

            builder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");
            });

            builder.Entity<UserRole>(entity =>
            {
                entity.ToTable("UserRoles");
            });

            builder.Entity<UserClaim>(entity =>
            {
                entity.ToTable("UserClaims");
            });

            builder.Entity<UserLogin>(entity =>
            {
                entity.ToTable("UserLogins");
            });

            builder.Entity<RoleClaim>(entity =>
            {
                entity.ToTable("RoleClaims");
            });

            builder.Entity<UserToken>(entity =>
            {
                entity.ToTable("UserTokens");
            });
        }
    }
}
