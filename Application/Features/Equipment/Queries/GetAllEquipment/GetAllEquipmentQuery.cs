using Application.DTOs.Equipment;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Equipment.Queries.GetAllEquipment
{
    public class GetAllEquipmentQuery : IRequest<PagedResponse<IEnumerable<GetAllEquipmentViewModel>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public string PurposeOfUse { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public DateTime? DateCreate { get; set; }
        public DateTime? DateCommissioning { get; set; }
        public string InventoryNumber { get; set; }
        public string Description { get; set; }
        public int? ManufacturerId { get; set; }
        public int? DepartmentId { get; set; }
        public int? LocationId { get; set; }
        public int? TypeId { get; set; }
        public int? TagId { get; set; }
        public string FifNumber { get; set; }
        public string Accuracy { get; set; }
        public string ClassAccuracy { get; set; }
        public string MeasuringRange { get; set; }
        public string MeasuringWork { get; set; }
        public string Characteristics { get; set; }
    }
    public class GetAllEquipmentQueryHandler : IRequestHandler<GetAllEquipmentQuery, PagedResponse<IEnumerable<GetAllEquipmentViewModel>>>
    {
        private readonly IEquipmentRepositoryAsync _equipmentRepositoryAsync;
        private readonly IMapper _mapper;

        public GetAllEquipmentQueryHandler(IEquipmentRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _equipmentRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<IEnumerable<GetAllEquipmentViewModel>>> Handle(GetAllEquipmentQuery request, CancellationToken cancellationToken)
        {
            var validFilter = _mapper.Map<GetAllEquipmentParameter>(request);
            var equipment = await _equipmentRepositoryAsync.GetPagedReponseAsync(validFilter);
            
            var totalRecords = await _equipmentRepositoryAsync.CountAsync(validFilter);
            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);

            var equipmentViewModel = _mapper.Map<IEnumerable<GetAllEquipmentViewModel>>(equipment);

            PagedResponse<IEnumerable<GetAllEquipmentViewModel>> response = new PagedResponse<IEnumerable<GetAllEquipmentViewModel>>(equipmentViewModel, validFilter.PageNumber, validFilter.PageSize);

            response.TotalPages = Convert.ToInt32(Math.Ceiling(totalPages));
            response.TotalRecords = totalRecords;

            return response;
        }
    }
}
