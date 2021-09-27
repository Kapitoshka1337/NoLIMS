using Application.Features.Equipment.Queries.GetAllEquipment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Equipment
{
    public interface IEquipmentRepositoryAsync : IGenericRepositoryAsync<Domain.Entities.Equipment.Equipment>
    {
        Task<IReadOnlyList<Domain.Entities.Equipment.Equipment>> GetPagedReponseAsync(GetAllEquipmentParameter filter);
        Task<int> CountAsync(GetAllEquipmentParameter filter);
    }
}
