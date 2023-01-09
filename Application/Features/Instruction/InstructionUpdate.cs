using Application.Interfaces.Repositories.Instruction;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Instruction.GetAll;

namespace Application.Features.Instruction
{
    public class InstructionUpdate : IRequest<Response<ViewModel>>
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public string Number { get; set; }
        public int FileId { get; set; }
    }

    public class InstuctionUpdateHandler : IRequestHandler<InstructionUpdate, Response<ViewModel>>
    {
        private readonly IInstructionRepository _repository;
        private readonly IMapper _mapper;
        public InstuctionUpdateHandler(IInstructionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Response<ViewModel>> Handle(InstructionUpdate request, CancellationToken cancellationToken)
        {
            var equipmentDto = _mapper.Map<DTOs.Equipment.Instruction>(request);
            var equipmentBase = _mapper.Map<Domain.Entities.Equipment.Instruction>(equipmentDto);
            await _repository.UpdateAsync(equipmentBase);

            var equipmentViewModel = _mapper.Map<ViewModel>(equipmentBase);
            
            return new Response<ViewModel>(equipmentViewModel);
        }
    }
}
