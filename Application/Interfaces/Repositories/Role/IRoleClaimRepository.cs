using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Equipment
{
    public interface IRoleClaimRepository : IGenericRepositoryAsync<Domain.Entities.Role.RoleClaim>
    {
        Task<Domain.Entities.Role.RoleClaim> Find(Expression<Func<Domain.Entities.Role.RoleClaim, bool>> predicate);
    }
}
