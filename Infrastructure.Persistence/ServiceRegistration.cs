using Application.Interfaces;
using Application.Interfaces.Repositories.Base;
using Application.Interfaces.Repositories.Equipment;
using Application.Interfaces.Repositories.Instruction;
using Application.Interfaces.Repositories.Storage;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Persistence.Repository;
using Infrastructure.Persistence.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Persistence
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("ApplicationDb"));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
               options.UseNpgsql(
                   configuration.GetConnectionString("DefaultConnection"),
                   b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }

            #region Repositories
            
            services.AddTransient(typeof(IGenericRepositoryAsync<>), typeof(GenericRepositoryAsync<>));
            services.AddTransient<IEquipmentRepositoryAsync, EquipmentRepositoryAsync>();
            services.AddTransient<IVerificationRepositoryAsync, VerificationRepositoryAsync>();
            services.AddTransient<ICheckRepository, CheckRepository>();
            services.AddTransient<IDocumentKindRepository, DocumentKindRepository>();
            services.AddTransient<IFileRepository, FileRepository>();
            services.AddTransient<IManufacturerRepository, ManufacturerRepository>();
            services.AddTransient<IDepartmentRepository, DepartmentRepository>();
            services.AddTransient<ILocationRepository, LocationRepository>();
            services.AddTransient<IInstructionRepository, InstructionRepository>();
            services.AddTransient<ITypeRepository, TypeRepository>();
            services.AddTransient<IRoleRepository, RoleRepository>();
            services.AddTransient<IReportServices, ReportServices>();

            #endregion
        }
    }
}
