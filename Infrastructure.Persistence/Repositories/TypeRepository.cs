using Application.Features.Type.GetAll;
using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class TypeRepository : GenericRepositoryAsync<Type>, ITypeRepository
    {
        public TypeRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
