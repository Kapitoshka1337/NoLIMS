using Application.Exceptions;
using Application.DTOs.Equipment;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DocumentKind
{
    public class UpdateDocumentKind : IRequest<Response<DocumentKindDto>> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateManufacturerHandler : IRequestHandler<UpdateDocumentKind, Response<DocumentKindDto>>
    {
        private readonly IDocumentKindRepository _repository;
        private readonly IMapper _mapper;

        public UpdateManufacturerHandler(IDocumentKindRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<DocumentKindDto>> Handle(UpdateDocumentKind command, CancellationToken cancellationToken)
        {
            var item = await _repository.GetByIdAsync(command.Id);
            var itemViewModel = _mapper.Map<DocumentKindDto>(item);

            if (item == null)
            {
                string msg = $"Вид документа с ИД \"{command.Id}\" не найден.";
                Response<DocumentKindDto> rsp = new Response<DocumentKindDto>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            item.Name = command.Name;

            await _repository.UpdateAsync(item);

            return new Response<DocumentKindDto>(itemViewModel);
        }
    }
}
