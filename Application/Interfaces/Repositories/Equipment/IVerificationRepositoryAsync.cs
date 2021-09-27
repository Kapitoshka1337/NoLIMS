using Application.Features.Verification.GetAllVerification;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Equipment
{
    public interface IVerificationRepositoryAsync : IGenericRepositoryAsync<Domain.Entities.Equipment.Verification.Verification>
    {
        Task<IReadOnlyList<Domain.Entities.Equipment.Verification.Verification>> GetPagedReponseAsync(GetAllVerificationParameter filter);
        Task<int> CountAsync(GetAllVerificationParameter filter);
    }
}
