using Application.Interfaces.Repositories.Base;
using Application.Features.Base.Department.GetAll;
using Domain.Entities.Base;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Infrastructure.Persistence.Repositories
{
    public class DepartmentRepository : GenericRepositoryAsync<Department>, IDepartmentRepository
    {
        private readonly DbSet<Department> _repository;

        public DepartmentRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _repository = dbContext.Set<Department>();
        }

        public async Task<int> CountAsync(Parameter filter)
        {
            return await _repository.Filter(filter).CountAsync();
        }

        public async Task<IReadOnlyList<Department>> GetPagedReponseAsync(Parameter filter)
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
