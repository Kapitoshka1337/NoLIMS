using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DocumentKind.GetAll
{
    public class GetAllDocumentKindQuery : IRequest<PagedResponse<IEnumerable<GetAllDocumentKindViewModel>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
    }

    public class GetAllDocumentKindQueryHandler : IRequestHandler<GetAllDocumentKindQuery, PagedResponse<IEnumerable<GetAllDocumentKindViewModel>>>
    {
        private readonly IDocumentKindRepository _documentKindRepository;
        private readonly IMapper _mapper;

        public GetAllDocumentKindQueryHandler(IDocumentKindRepository equipmentRepository, IMapper mapper)
        {
            _documentKindRepository = equipmentRepository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<IEnumerable<GetAllDocumentKindViewModel>>> Handle(GetAllDocumentKindQuery request, CancellationToken cancellationToken)
        {
            var validFilter = _mapper.Map<GetAllDocumentKindParameter>(request);
            var equipment = await _documentKindRepository.GetPagedReponseAsync(validFilter);
            
            var totalRecords = await _documentKindRepository.CountAsync(validFilter);
            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);

            var equipmentViewModel = _mapper.Map<IEnumerable<GetAllDocumentKindViewModel>>(equipment);

            PagedResponse<IEnumerable<GetAllDocumentKindViewModel>> response = new PagedResponse<IEnumerable<GetAllDocumentKindViewModel>>(equipmentViewModel, validFilter.PageNumber, validFilter.PageSize);

            response.TotalPages = Convert.ToInt32(Math.Ceiling(totalPages));
            response.TotalRecords = totalRecords;

            return response;
        }
    }
}
