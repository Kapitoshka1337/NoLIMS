using Application.Interfaces.Repositories.Base;
using Application.Features.Base.Location.GetAll;
using Application.Filters;
using Domain.Entities.Base;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class LocationRepository : GenericRepositoryAsync<Location>, ILocationRepository
    {
        private readonly DbSet<Location> _locations;

        public LocationRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _locations = dbContext.Set<Location>();
        }

        public override async Task<Location> GetByIdAsync(int id)
        {
            return await _locations.FindAsync(id);
        }

        public async Task<int> CountAsync(Parameter filter)
        {
            return await _locations.Filter(filter).CountAsync();
        }

        public async Task<IReadOnlyList<Location>> GetPagedReponseAsync(Parameter filter)
        {
            var equipments = await _locations
                .Include(l => l.Department)
                .Filter(filter)
                .Sort(filter.SortBy)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .AsNoTracking()
                .ToListAsync();

            return equipments;
        }
    }
}
