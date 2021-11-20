using Application.Interfaces.Repositories.Equipment;
using System.Threading.Tasks;
using System.Linq;

namespace Infrastructure.Persistence.Seeds
{
    public static class DefaultTags
    {
        public static async Task SeedAsync(ITagsRepository tagsRepository)
        {
            var tags = await tagsRepository.GetAllAsync();
            var tagsCount = tags.Count();

            if (tagsCount <= 0)
            {
                await tagsRepository.AddAsync(new Domain.Entities.Equipment.Tags() { Name = Application.Enums.Tags.Архив.ToString() });
                await tagsRepository.AddAsync(new Domain.Entities.Equipment.Tags() { Name = Application.Enums.Tags.Используется.ToString() });
                await tagsRepository.AddAsync(new Domain.Entities.Equipment.Tags() { Name = Application.Enums.Tags.Консервация.ToString() });
                await tagsRepository.AddAsync(new Domain.Entities.Equipment.Tags() { Name = Application.Enums.Tags.Ремонт.ToString() });
                await tagsRepository.AddAsync(new Domain.Entities.Equipment.Tags() { Name = Application.Enums.Tags.ЦСМ.ToString() });
            }
        }
    }
}
