using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Verification.GetAllVerification
{
    public class GetAllVerificationQuery : IRequest<PagedResponse<IEnumerable<GetAllVerificationViewModel>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public string EquipmentName { get; set; }
        public string EquipmentModel { get; set; }
        public string EquipmentSerialNumber { get; set; }
        public int StatusId { get; set; }
    }

    public class GetAllEquipmentQueryHandler : IRequestHandler<GetAllVerificationQuery, PagedResponse<IEnumerable<GetAllVerificationViewModel>>>
    {
        private readonly IVerificationRepositoryAsync _equipmentRepositoryAsync;
        private readonly IMapper _mapper;

        public GetAllEquipmentQueryHandler(IVerificationRepositoryAsync equipmentRepository, IMapper mapper)
        {
            _equipmentRepositoryAsync = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<IEnumerable<GetAllVerificationViewModel>>> Handle(GetAllVerificationQuery request, CancellationToken cancellationToken)
        {
            var validFilter = _mapper.Map<GetAllVerificationParameter>(request);
            var equipment = await _equipmentRepositoryAsync.GetPagedReponseAsync(validFilter);

            var totalRecords = await _equipmentRepositoryAsync.CountAsync(validFilter);
            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);

            var equipmentViewModel = _mapper.Map<IEnumerable<GetAllVerificationViewModel>>(equipment);

            PagedResponse<IEnumerable<GetAllVerificationViewModel>> response = new PagedResponse<IEnumerable<GetAllVerificationViewModel>>(equipmentViewModel, validFilter.PageNumber, validFilter.PageSize);

            response.TotalPages = Convert.ToInt32(Math.Ceiling(totalPages));
            response.TotalRecords = totalRecords;

            return response;
        }
    }
}
