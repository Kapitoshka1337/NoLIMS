using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class DocumentKindRepository : GenericRepositoryAsync<DocumentKind>, IDocumentKindRepository
    {
        private readonly DbSet<DocumentKind> _documentKinds;

        public DocumentKindRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _documentKinds = dbContext.Set<DocumentKind>();
        }
    }
}
