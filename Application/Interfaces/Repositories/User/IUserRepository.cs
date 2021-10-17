using Application.Filters;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.User
{
    public interface IUserRepository : IGenericRepositoryAsync<Domain.Entities.User.ApplicationUser>
    {
        Task<Domain.Entities.User.ApplicationUser> Find(Expression<Func<Domain.Entities.User.ApplicationUser, bool>> predicate);
        Task<int> CountAsync(RequestParameter filter);
    }
}
