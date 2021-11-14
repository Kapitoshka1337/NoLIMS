using Application.Features.Manufacturer.GetAll;
using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class ManufacturerRepository : GenericRepositoryAsync<Manufacturer>, IManufacturerRepository
    {
        private readonly DbSet<Manufacturer> _manufacturer;

        public ManufacturerRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _manufacturer = dbContext.Set<Manufacturer>();
        }

        public async Task<int> CountAsync(GetAllManufacturerParameter filter)
        {
            return await _manufacturer.Filter(filter).CountAsync();
        }

        public async Task<IReadOnlyList<Manufacturer>> GetPagedReponseAsync(GetAllManufacturerParameter filter)
        {
            var equipments = await _manufacturer
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
