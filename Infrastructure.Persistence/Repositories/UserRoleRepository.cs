using Application.Filters;
using Application.Interfaces.Repositories.UserRole;
using Domain.Entities.User;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class UserRoleRepository : GenericRepositoryAsync<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<int> CountAsync(RequestParameter filter)
        {
            return await _dbContext.Users.Filter(filter).CountAsync();
        }

        public async Task<IEnumerable<UserRole>> Find(Expression<Func<UserRole, bool>> predicate)
        {
            var claims = await _dbContext.UserRoles.Where(predicate).ToListAsync();

            return claims;
        }

        public async override Task<IReadOnlyList<UserRole>> GetPagedReponseAsync(RequestParameter filter)
        {
            return await _dbContext.UserRoles
                .Sort(filter.SortBy)
                .Filter(filter)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
