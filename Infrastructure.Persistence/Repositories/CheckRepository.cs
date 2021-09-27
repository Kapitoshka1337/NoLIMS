using Application.Features.Check.GetAll;
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
    public class CheckRepository : GenericRepositoryAsync<Check>, ICheckRepository
    {
        private readonly DbSet<Check> _repository;

        public CheckRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _repository = dbContext.Set<Check>();
        }

        public async Task<int> CountAsync(Parameter filter)
        {
            return await _repository.FilterDateCheck(filter).CountAsync();
        }

        public async Task<IReadOnlyList<Check>> GetPagedReponseAsync(Parameter filter)
        {
            var equipments = await _repository
                .Include(e => e.Equipment).ThenInclude(e => e.Type)
                .Include(e => e.DocumentKind)
                .FilterDateCheck(filter)
                .Sort(filter.SortBy)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .AsNoTracking()
                .ToListAsync();

            return equipments;
        }
    }
}
