using Application.Features.Instruction.GetAll;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Instruction
{
    public interface IInstructionRepository : IGenericRepositoryAsync<Domain.Entities.Equipment.Instruction>
    {
        Task<IReadOnlyList<Domain.Entities.Equipment.Instruction>> GetPagedReponseAsync(Parameter filter);
        Task<int> CountAsync(Parameter filter);
    }
}
