using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class ManufacturerRepository : GenericRepositoryAsync<Manufacturer>, IManufacturerRepository
    {
        private readonly DbSet<Manufacturer> _manufacturer;

        public ManufacturerRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _manufacturer = dbContext.Set<Manufacturer>();
        }
    }
}
