using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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

        public override async Task<IReadOnlyList<Moving>> GetAllAsync()
        {
            return await _repository
                .Include(m => m.CurrentDepartment)
                .Include(m => m.NextDepartment)
                .ToListAsync();
        }
    }
}
