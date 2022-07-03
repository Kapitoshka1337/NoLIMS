using Application.Exceptions;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs.Equipment;
using Application.Interfaces.Repositories.Equipment;
using Application.Features.Check.GetAll;

namespace Application.Features.Check
{
    public class GetOne : IRequest<Response<ViewModel>>
    {
        public int Id { get; set; }
    }

    public class GetOneHandler : IRequestHandler<GetOne, Response<ViewModel>>
    {
        private readonly ICheckRepository _repository;
        private readonly IMapper _mapper;

        public GetOneHandler(ICheckRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(GetOne query, CancellationToken cancellationToken)
        {
            var equipment = await _repository.GetByIdAsync(query.Id);

            if (equipment == null)
            {
                string msg = $"Вид документа с ИД \"{query.Id}\" не найден.";
                Response<ViewModel> rsp = new Response<ViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            var equipmentViewModel = _mapper.Map<ViewModel>(equipment);

            return new Response<ViewModel>(equipmentViewModel);
        }
    }
}
