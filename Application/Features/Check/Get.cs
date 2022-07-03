using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs.Equipment;
using Application.Interfaces.Repositories.Equipment;

namespace Application.Features.Check
{
    public class GetOne : IRequest<Response<DocumentKindDto>>
    {
        public int Id { get; set; }
    }

    public class GetOneHandler : IRequestHandler<GetOne, Response<DocumentKindDto>>
    {
        private readonly IDocumentKindRepository _repository;
        private readonly IMapper _mapper;

        public GetOneHandler(IDocumentKindRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<DocumentKindDto>> Handle(GetOne query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
            {
                string msg = $"Вид документа с ИД \"{query.Id}\" не найден.";
                Response<DocumentKindDto> rsp = new Response<DocumentKindDto>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            var equipmentViewModel = _mapper.Map<DocumentKindDto>(equipment);

            return new Response<DocumentKindDto>(equipmentViewModel);
        }
    }
}
