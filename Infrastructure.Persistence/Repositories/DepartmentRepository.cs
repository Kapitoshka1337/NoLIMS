using Application.Interfaces.Repositories.Base;
using Domain.Entities.Base;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class DepartmentRepository : GenericRepositoryAsync<Department>, IDepartmentRepository
    {
        private readonly DbSet<Department> _departments;

        public DepartmentRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _departments = dbContext.Set<Department>();
        }
    }
}
