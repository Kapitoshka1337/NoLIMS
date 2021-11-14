using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;

namespace Infrastructure.Persistence.Repositories
{
    public class TagsRepository : GenericRepositoryAsync<Tags>, ITagsRepository
    {
        public TagsRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
