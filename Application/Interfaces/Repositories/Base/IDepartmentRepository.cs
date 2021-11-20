using Domain.Entities.Base;
using Application.Features.Base.Department.GetAll;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Base
{
    public interface IDepartmentRepository : IGenericRepositoryAsync<Department>
    {
        Task<IReadOnlyList<Department>> GetPagedReponseAsync(Parameter filter);
        Task<int> CountAsync(Parameter filter);
    }
}
