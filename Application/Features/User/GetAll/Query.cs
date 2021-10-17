using Application.Interfaces.Repositories.User;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.User.GetAll
{
    public class Query : IRequest<PagedResponse<IEnumerable<ViewModel>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
    }

    public class QueryHandler : IRequestHandler<Query, PagedResponse<IEnumerable<ViewModel>>>
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public QueryHandler(IUserRepository repository, IMapper mapper)
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
