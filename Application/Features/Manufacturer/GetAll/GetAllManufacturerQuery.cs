using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Manufacturer.GetAll
{
    public class GetAllManufacturerQuery : IRequest<PagedResponse<IEnumerable<GetAllManufacturerViewModel>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }

    public class GetAllManufacturerQueryHandler : IRequestHandler<GetAllManufacturerQuery, PagedResponse<IEnumerable<GetAllManufacturerViewModel>>>
    {
        private readonly IManufacturerRepository _manufacturerRepository;
        private readonly IMapper _mapper;

        public GetAllManufacturerQueryHandler(IManufacturerRepository manufacturerRepository, IMapper mapper)
        {
            _manufacturerRepository = manufacturerRepository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<IEnumerable<GetAllManufacturerViewModel>>> Handle(GetAllManufacturerQuery request, CancellationToken cancellationToken)
        {
            var validFilter = _mapper.Map<GetAllManufacturerParameter>(request);
            var manufacturers = await _manufacturerRepository.GetPagedReponseAsync(validFilter);

            var totalRecords = await _manufacturerRepository.CountAsync(validFilter);
            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);

            var equipmentViewModel = _mapper.Map<IEnumerable<GetAllManufacturerViewModel>>(manufacturers);

            PagedResponse<IEnumerable<GetAllManufacturerViewModel>> response = new PagedResponse<IEnumerable<GetAllManufacturerViewModel>>(equipmentViewModel, validFilter.PageNumber, validFilter.PageSize);

            response.TotalPages = Convert.ToInt32(Math.Ceiling(totalPages));
            response.TotalRecords = totalRecords;

            return response;
        }
    }
}
