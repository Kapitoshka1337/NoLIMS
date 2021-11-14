using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Microsoft.AspNetCore.Identity;
using Domain.Entities.User;
using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Persistence.Contexts;
using Domain.Entities.Role;
using Infrastructure.Persistence.Repositories;
using Application.Interfaces.Repositories.Equipment;

namespace WebApi
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(config).CreateLogger();
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                
                try
                {
                    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                    var roleManager = services.GetRequiredService<RoleManager<Role>>();
                    var db = services.GetRequiredService<ApplicationDbContext>();
                    var tags = services.GetRequiredService<ITagsRepository>();

                    await Infrastructure.Persistence.Seeds.DefaultTags.SeedAsync(tags);
                    await Infrastructure.Identity.Seeds.DefaultRoles.SeedAsync(userManager, roleManager, db);
                    await Infrastructure.Identity.Seeds.DefaultUser.SeedAsync(userManager, roleManager);
            
                    Log.Information("Finished Seeding Default Data");
                    Log.Information("Application Starting");
                }
                catch (Exception ex)
                {
                    Log.Warning(ex, "An error occurred seeding the DB");
                }
                finally
                {
                    Log.CloseAndFlush();
                }
            }
            host.Run();
        }
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    //webBuilder.UseUrls("http://0.0.0.0:9001");
                });
    }
}
