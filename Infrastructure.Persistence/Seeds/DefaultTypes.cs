using Application.Interfaces.Repositories.Equipment;
using System.Threading.Tasks;
using System.Linq;

namespace Infrastructure.Persistence.Seeds
{
    public static class DefaultTypes
    {
        public static async Task SeedAsync(ITypeRepository typeRepository)
        {
            var tags = await typeRepository.GetAllAsync();
            var tagsCount = tags.Count();

            if (tagsCount <= 0)
            {
                await typeRepository.AddAsync(new Domain.Entities.Equipment.Type() { Name = Application.Enums.EquipmentTypes.VO });
                await typeRepository.AddAsync(new Domain.Entities.Equipment.Type() { Name = Application.Enums.EquipmentTypes.IO });
                await typeRepository.AddAsync(new Domain.Entities.Equipment.Type() { Name = Application.Enums.EquipmentTypes.CI });
            }
        }
    }
}
