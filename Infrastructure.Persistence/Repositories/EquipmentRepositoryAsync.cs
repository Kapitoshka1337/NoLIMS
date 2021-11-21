using Application.Interfaces.Repositories.Equipment;
using Domain.Entities.Equipment;
using Infrastructure.Persistence.Contexts;
using Infrastructure.Persistence.Extension;
using Infrastructure.Persistence.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Application.Features.Equipment.Queries.GetAllEquipment;
using AutoMapper;

namespace Infrastructure.Persistence.Repositories
{
    public class EquipmentRepositoryAsync : GenericRepositoryAsync<Equipment>, IEquipmentRepositoryAsync
    {
        private readonly DbSet<Equipment> _equipments;

        public EquipmentRepositoryAsync(ApplicationDbContext dbContext) : base(dbContext)
        {
            _equipments = dbContext.Set<Equipment>();
        }

        public override async Task<Equipment> GetByIdAsync(int id)
        {
            return await _equipments
                .Include(e => e.Tag)
                .Where(e => e.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<Equipment>> GetPagedReponseAsync(GetAllEquipmentParameter filter)
        {
            var equipments = await _equipments
                .Include(e => e.Department)
                //.Include(e => e.Location)
                .Include(e => e.Manufacturer)
                .Include(e => e.Type)
                .Include(e => e.Tag)
                .OrderBy(e => e.Id)
                .FilterEquipment(filter)
                .Sort(filter.SortBy)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .AsNoTracking()
                .ToListAsync();

            return equipments;
        }

        public async Task<int> CountAsync(GetAllEquipmentParameter filter)
        {
            return await _equipments.FilterEquipment(filter).CountAsync();
        }
    }
}
