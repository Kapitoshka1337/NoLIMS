using Application.Interfaces;
using Domain.Common;
using Domain.Entities.Base;
using Domain.Entities.Equipment;
using Domain.Entities.Equipment.Verification;
using Domain.Entities.Role;
using Domain.Entities.Storage;
using Domain.Entities.User;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Contexts
{
    public class ApplicationDbContext : IdentityDbContext<Domain.Entities.User.ApplicationUser, Role, int, UserClaim, UserRole, UserLogin, RoleClaim, UserToken>
    {
        private readonly IDateTimeService _dateTime;
        private readonly IAuthenticatedUserService _authenticatedUser;
        private readonly ILoggerFactory _loggerFactory;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDateTimeService dateTime, IAuthenticatedUserService authenticatedUser, ILoggerFactory loggerFactory) : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            _dateTime = dateTime;
            _authenticatedUser = authenticatedUser;
            _loggerFactory = loggerFactory;
        }
        
        // Базовые сущности.
        public DbSet<BusinessUnit> BusinessUnits { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Location>  Locations { get; set; }
        
        // Оборудование.
        public DbSet<Equipment>  Equipment { get; set; }
        public DbSet<Type> Types { get; set; }
        public DbSet<Manufacturer>  Manufacturers { get; set; }
        public DbSet<Tags> Tags { get; set; }
        public DbSet<Instruction> Instructions { get; set; }
        public DbSet<Verification>  Verifications { get; set; }
        public DbSet<VerificationStatus>  VerificationStatus { get; set; }
        public DbSet<Check>  Checks { get; set; }
        public DbSet<DocumentKind> DocumentKinds { get; set; }
        public DbSet<Moving> Movings { get; set; }

        // Файловое хранилище.
        public DbSet<File> Files { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            foreach (var entry in ChangeTracker.Entries<AuditableBaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.Created = _dateTime.NowUtc;
                        entry.Entity.CreatedBy = _authenticatedUser.UserId;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModified = _dateTime.NowUtc;
                        entry.Entity.LastModifiedBy = _authenticatedUser.UserId;
                        break;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            //All Decimals will have 18,6 Range
            foreach (var property in builder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetColumnType("decimal(18,6)");
            }

            base.OnModelCreating(builder);

            builder.Entity<Domain.Entities.User.ApplicationUser>(entity =>
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

            builder.Entity<Check>(entity =>
            {
                entity.Property(p => p.CurrentCheck).HasDefaultValue(null);
                entity.Property(p => p.NextCheck).HasDefaultValue(null);
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(_loggerFactory);
        }
    }
}
