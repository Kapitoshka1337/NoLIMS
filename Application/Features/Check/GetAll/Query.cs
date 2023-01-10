using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Check.GetAll
{
    public class Query : IRequest<PagedResponse<IEnumerable<ViewModel>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public string NumberDocument { get; set; }
        public DateTime? CurrentCheckStart { get; set; }
        public DateTime? CurrentCheckEnd { get; set; }
        public DateTime? NextCheckStart { get; set; }
        public DateTime? NextCheckEnd { get; set; }
        public int EquipmentId { get; set; }
        public int DocumentKindId { get; set; }
        public int? TypeId { get; set; }
        public int? DepartmentId { get; set; }
        public string Number { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public int? TagId { get; set; }

        //public EqViewModelSearch Equipment { get; set; }
    }

    public class QueryHandler : IRequestHandler<Query, PagedResponse<IEnumerable<ViewModel>>>
    {
        private readonly ICheckRepository _repository;
        private readonly IMapper _mapper;

        public QueryHandler(ICheckRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<IEnumerable<ViewModel>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var validFilter = _mapper.Map<Parameter>(request);
            var manufacturers = await _repository.GetPagedReponseAsync(validFilter);

            var totalRecords = await _repository.CountAsync(validFilter);
            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);

            var equipmentViewModel = _mapper.Map<IEnumerable<ViewModel>>(manufacturers);

            PagedResponse<IEnumerable<ViewModel>> response = new PagedResponse<IEnumerable<ViewModel>>(equipmentViewModel, validFilter.PageNumber, validFilter.PageSize);

            response.TotalPages = Convert.ToInt32(Math.Ceiling(totalPages));
            response.TotalRecords = totalRecords;

            return response;
        }
    }
}
