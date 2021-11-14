using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Tags.GetAll;
using Application.Interfaces.Repositories.Equipment;

namespace Application.Features.Tags
{
    public class ByIdTagQuery : IRequest<Response<ViewModel>>
    {
        public int Id { get; set; }
    }

    public class ByIdTagQueryHandler : IRequestHandler<ByIdTagQuery, Response<ViewModel>>
    {
        private readonly ITagsRepository _repository;
        private readonly IMapper _mapper;

        public ByIdTagQueryHandler(ITagsRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(ByIdTagQuery query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
                throw new ApiException($"Тег с ИД \"{query.Id}\" не найден.");

            var equipmentViewModel = _mapper.Map<ViewModel>(equipment);

            return new Response<ViewModel>(equipmentViewModel);
        }
    }
}
