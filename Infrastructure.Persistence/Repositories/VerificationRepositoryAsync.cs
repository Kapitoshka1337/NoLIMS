using Application.Features.Verification.GetAllVerification;
using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment.Verification;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class VerificationRepositoryAsync : GenericRepositoryAsync<Verification>, IVerificationRepositoryAsync
    {
        private readonly DbSet<Verification> _verifications;

        public VerificationRepositoryAsync(ApplicationDbContext dbContext) : base(dbContext)
        {
            _verifications = dbContext.Set<Verification>();
        }

        public override async Task<Verification> GetByIdAsync(int id)
        {
            return await _verifications
                .IncludeMultiple(v => v.Equipment)
                .Where(e => e.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<Verification>> GetPagedReponseAsync(GetAllVerificationParameter filter)
        {
            var verifications = await _verifications
                .Include(v => v.Equipment)
                .Include(v => v.Status)
                .FilterVerification(filter)
                .Sort(filter.SortBy)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Where(v => v.StatusId != 4)
                .AsNoTracking()
                .ToListAsync();

            return verifications;
        }

        public async Task<int> CountAsync(GetAllVerificationParameter filter)
        {
            return await _verifications.FilterVerification(filter).CountAsync();
        }
    }
}
