using Application.Features.User.GetAll;
using Application.Filters;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.User
{
    public interface IApplicationUserRepository : IGenericRepositoryAsync<Domain.Entities.User.ApplicationUser>
    {
        Task<Domain.Entities.User.ApplicationUser> Find(Expression<Func<Domain.Entities.User.ApplicationUser, bool>> predicate);
        Task<int> CountAsync(RequestParameter filter);
        Task<IReadOnlyList<Domain.Entities.User.ApplicationUser>> GetPagedReponseAsync(Parameter filter);
        Task<int> CountAsync(Parameter filter);
    }
}
