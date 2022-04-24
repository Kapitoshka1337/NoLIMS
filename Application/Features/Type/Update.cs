using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Features.Type.GetAll;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Type
{
    public class UpdateType : IRequest<Response<ViewModel>> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateTypeHandler : IRequestHandler<UpdateType, Response<ViewModel>>
    {
        private readonly ITypeRepository _repository;
        private readonly IMapper _mapper;

        public UpdateTypeHandler(ITypeRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(UpdateType command, CancellationToken cancellationToken)
        {
            var item = await _repository.GetByIdAsync(command.Id);
            var itemViewModel = _mapper.Map<ViewModel>(item);

            if (item == null)
            {
                string msg = $"Тип оборудования с ИД \"{command.Id}\" не найден.";
                Response<ViewModel> rsp = new Response<ViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            item.Name = command.Name;

            await _repository.UpdateAsync(item);

            return new Response<ViewModel>(itemViewModel);
        }
    }
}
