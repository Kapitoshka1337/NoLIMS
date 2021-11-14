using Application.Features.Manufacturer.GetAll;
using Domain.Entities.Equipment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Equipment
{
    public interface IManufacturerRepository : IGenericRepositoryAsync<Manufacturer>
    {
        Task<IReadOnlyList<Domain.Entities.Equipment.Manufacturer>> GetPagedReponseAsync(GetAllManufacturerParameter filter);
        Task<int> CountAsync(GetAllManufacturerParameter filter);
    }
}
