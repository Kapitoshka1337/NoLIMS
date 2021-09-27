using Application.Interfaces.Repositories.Storage;
using Domain.Entities.Storage;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class FileRepository : GenericRepositoryAsync<File>, IFileRepository
    {
        private readonly DbSet<File> _files;

        public FileRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _files = dbContext.Set<File>();
        }
    }
}
