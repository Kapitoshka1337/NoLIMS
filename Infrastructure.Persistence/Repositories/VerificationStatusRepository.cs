using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment.Verification;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;

namespace Infrastructure.Persistence.Repositories
{
    public class VerificationStatusRepository : GenericRepositoryAsync<VerificationStatus>, IVerificationStatusRepository
    {
        public VerificationStatusRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
