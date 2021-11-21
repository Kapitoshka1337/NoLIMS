using Application.Features.Moving.GetAll;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities.Equipment;

namespace Application.Interfaces.Repositories.Equipment
{
    public interface IMovingRepository : IGenericRepositoryAsync<Moving>
    {
        Task<IReadOnlyList<Moving>> GetPagedReponseAsync(Parameter filter);
        Task<int> CountAsync(Parameter filter);
    }
}
