using Application.Interfaces.Repositories.Instruction;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Instruction
{
    public class InstructionUpdate : IRequest<Response<int>>
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public int FileId { get; set; }
    }

    public class InstuctionUpdateHandler : IRequestHandler<InstructionUpdate, Response<int>>
    {
        private readonly IInstructionRepository _repository;
        private readonly IMapper _mapper;
        public InstuctionUpdateHandler(IInstructionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(InstructionUpdate request, CancellationToken cancellationToken)
        {
            var equipmentDto = _mapper.Map<DTOs.Equipment.Instruction>(request);
            var equipmentBase = _mapper.Map<Domain.Entities.Equipment.Instruction>(equipmentDto);
            await _repository.UpdateAsync(equipmentBase);
            
            return new Response<int>(equipmentBase.Id);
        }
    }
}
