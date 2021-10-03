using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Role;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class RoleClaimRepository : GenericRepositoryAsync<RoleClaim>, IRoleClaimRepository
    {
        private readonly DbSet<RoleClaim> _repository;

        public RoleClaimRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _repository = dbContext.Set<RoleClaim>();
        }

        public async Task<RoleClaim> Find(Expression<Func<RoleClaim, bool>> predicate)
        {
            var claims = await _repository.Where(predicate).ToListAsync();

            return claims.FirstOrDefault();
        }
    }
}
