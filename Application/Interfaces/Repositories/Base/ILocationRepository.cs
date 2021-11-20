using Domain.Entities.Base;
using Application.Features.Base.Location.GetAll;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Base
{
    public interface ILocationRepository : IGenericRepositoryAsync<Location>
    {
        Task<IReadOnlyList<Location>> GetPagedReponseAsync(Parameter filter);
        Task<int> CountAsync(Parameter filter);
    }
}
