using Application.DTOs.Equipment;
using Application.Exceptions;
using Application.Features.Check.GetAll;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Check.Update
{
    public class UpdateCheck : IRequest<Response<ViewModel>>
    {
        public int Id { get; set; }
        public string NumberDocument { get; set; }
        public DateTime? CurrentCheck { get; set; }
        public DateTime? NextCheck { get; set; }
        public int EquipmentId { get; set; }
        public int DocumentKindId { get; set; }
        public int? FileId { get; set; }
    }

    public class UpdateCheckHandler : IRequestHandler<UpdateCheck, Response<ViewModel>>
    {
        private readonly ICheckRepository _repository;
        private readonly IMapper _mapper;

        public UpdateCheckHandler(ICheckRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(UpdateCheck command, CancellationToken cancellationToken)
        {
            var item = await _repository.GetByIdAsync(command.Id);
            var itemViewModel = _mapper.Map<ViewModel>(item);

            if (item == null)
            {
                string msg = $"Поверка с ИД \"{command.Id}\" не найдена.";
                Response<ViewModel> rsp = new Response<ViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            item.EquipmentId = command.EquipmentId;
            item.DocumentKindId = command.DocumentKindId;
            item.CurrentCheck = command.CurrentCheck;
            item.NextCheck = command.NextCheck;
            item.NumberDocument = command.NumberDocument;

            await _repository.UpdateAsync(item);

            return new Response<ViewModel>(itemViewModel);
        }
    }
}
