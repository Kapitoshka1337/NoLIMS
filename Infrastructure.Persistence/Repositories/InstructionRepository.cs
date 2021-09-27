using Application.Features.Instruction.GetAll;
using Application.Interfaces.Repositories.Instruction;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class InstructionRepository : GenericRepositoryAsync<Instruction>, IInstructionRepository
    {
        private readonly DbSet<Instruction> _repository;

        public InstructionRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _repository = dbContext.Set<Instruction>();
        }

        public async Task<int> CountAsync(Parameter filter)
        {
            return await _repository.Filter(filter).CountAsync();
        }

        public async Task<IReadOnlyList<Instruction>> GetPagedReponseAsync(Parameter filter)
        {
            var equipments = await _repository
                .Filter(filter)
                .Sort(filter.SortBy)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .AsNoTracking()
                .ToListAsync();

            return equipments;
        }
    }
}
