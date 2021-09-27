using Application.Features.Role.GetAll;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Equipment
{
    public interface IRoleRepository : IGenericRepositoryAsync<Domain.Entities.Role.Role>
    {
        Task<IReadOnlyList<Domain.Entities.Role.Role>> GetPagedReponseAsync(Parameter filter);
        Task<int> CountAsync(Parameter filter);
    }
}
