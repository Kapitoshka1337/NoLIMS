using Application.Features.Check.GetAll;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Equipment
{
    public interface ICheckRepository : IGenericRepositoryAsync<Domain.Entities.Equipment.Check>
    {
        Task<IReadOnlyList<Domain.Entities.Equipment.Check>> GetPagedReponseAsync(Parameter filter);
        Task<int> CountAsync(Parameter filter);
    }
}
