using Application.Interfaces.Repositories.Base;
using Domain.Entities.Base;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class LocationRepository : GenericRepositoryAsync<Location>, ILocationRepository
    {
        private readonly DbSet<Location> _locations;

        public LocationRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _locations = dbContext.Set<Location>();
        }
    }
}
