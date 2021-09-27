using Application.Features.Role.GetAll;
using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Role;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class RoleRepository : GenericRepositoryAsync<Role>, IRoleRepository
    {
        private readonly DbSet<Role> _repository;

        public RoleRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _repository = dbContext.Set<Role>();
        }

        public async Task<int> CountAsync(Parameter filter)
        {
            return await _repository.Filter(filter).CountAsync();
        }

        public async Task<IReadOnlyList<Role>> GetPagedReponseAsync(Parameter filter)
        {
            var equipments = await _repository
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
