using Application.Filters;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.UserRole
{
    public interface IUserRoleRepository : IGenericRepositoryAsync<Domain.Entities.User.UserRole>
    {
        Task<IEnumerable<Domain.Entities.User.UserRole>> Find(Expression<Func<Domain.Entities.User.UserRole, bool>> predicate);
        Task<int> CountAsync(RequestParameter filter);
    }
}
