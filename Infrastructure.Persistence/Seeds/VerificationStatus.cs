using Application.Interfaces.Repositories.Equipment;
using System.Threading.Tasks;
using System.Linq;

namespace Infrastructure.Persistence.Seeds
{
    public static class VerificationStatus
    {
        public static async Task SeedAsync(IVerificationStatusRepository repository)
        {
            var tags = await repository.GetAllAsync();
            var tagsCount = tags.Count();

            if (tagsCount <= 0)
            {
                await repository.AddAsync(new Domain.Entities.Equipment.Verification.VerificationStatus() { Name = Application.Enums.VerificationStatuses.Preparing });
                await repository.AddAsync(new Domain.Entities.Equipment.Verification.VerificationStatus() { Name = Application.Enums.VerificationStatuses.OnCheck });
                await repository.AddAsync(new Domain.Entities.Equipment.Verification.VerificationStatus() { Name = Application.Enums.VerificationStatuses.ReturnFromCheck });
                await repository.AddAsync(new Domain.Entities.Equipment.Verification.VerificationStatus() { Name = Application.Enums.VerificationStatuses.BackInDepartment });
            }
        }
    }
}
