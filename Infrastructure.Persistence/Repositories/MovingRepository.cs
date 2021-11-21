using Application.Features.Moving.GetAll;
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
    public class MovingRepository : GenericRepositoryAsync<Moving>, IMovingRepository
    {
        private readonly DbSet<Moving> _repository;

        public MovingRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _repository = dbContext.Set<Moving>();
        }

        public async Task<int> CountAsync(Parameter filter)
        {
            return await _repository.Filter(filter).CountAsync();
        }

        public async Task<IReadOnlyList<Moving>> GetPagedReponseAsync(Parameter filter)
        {
            var equipments = await _repository
                .Include(m => m.CurrentDepartment)
                .Include(m => m.NextDepartment)
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
