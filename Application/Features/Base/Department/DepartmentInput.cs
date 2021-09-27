using Application.Interfaces.Repositories.Base;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Department
{
    public class DepartmentInput : IRequest<Response<int>>
    {
        public string Name { get; set; }
        public string Number { get; set; }
    }

    public class DepartmentInputHandler : IRequestHandler<DepartmentInput, Response<int>>
    {
        private readonly IDepartmentRepository _repository;
        private readonly IMapper _mapper;
        public DepartmentInputHandler(IDepartmentRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(DepartmentInput request, CancellationToken cancellationToken)
        {
            var dto = _mapper.Map<DTOs.Base.Department>(request);
            var bases = _mapper.Map<Domain.Entities.Base.Department>(dto);
            await _repository.AddAsync(bases);

            return new Response<int>(bases.Id);
        }
    }
}
