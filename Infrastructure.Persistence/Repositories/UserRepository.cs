using Application.Features.User.GetAll;
using Application.Filters;
using Application.Interfaces.Repositories.User;
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
    public class UserRepository : GenericRepositoryAsync<ApplicationUser>, IApplicationUserRepository
    {
        public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<int> CountAsync(RequestParameter filter)
        {
            return await _dbContext.Users.Filter(filter).CountAsync();
        }

        public async Task<int> CountAsync(Parameter filter)
        {
            return await _dbContext.Users.FilterUser(filter).CountAsync();
        }

        public async Task<ApplicationUser> Find(Expression<Func<ApplicationUser, bool>> predicate)
        {
            var claims = await _dbContext.Users.Where(predicate).ToListAsync();

            return claims.FirstOrDefault();
        }

        public async override Task<IReadOnlyList<ApplicationUser>> GetPagedReponseAsync(RequestParameter filter)
        {
            return await _dbContext.Users
                .Filter(filter)
                .Sort(filter.SortBy)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IReadOnlyList<ApplicationUser>> GetPagedReponseAsync(Parameter filter)
        {
            return await _dbContext.Users
                .FilterUser(filter)
                .Sort(filter.SortBy)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
