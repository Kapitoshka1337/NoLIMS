using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Moving
{
    public class MovingInput : IRequest<Response<int>>
    {
        public int EquipmentId { get; set; }
        public int CurrentDepartmentId { get; set; }
        public int NextDepartmentId { get; set; }
        public int? CurrentLocationId { get; set; }
        public int? NextLocationId { get; set; }
        public DateTime MovingDate { get; set; }
    }

    public class MovingInputHandler : IRequestHandler<MovingInput, Response<int>>
    {
        private readonly IMovingRepository _repository;
        private readonly IEquipmentRepositoryAsync _erepository;
        private readonly IMapper _mapper;
        public MovingInputHandler(IMovingRepository repository, IEquipmentRepositoryAsync equipmentRepositoryAsync, IMapper mapper)
        {
            _repository = repository;
            _erepository = equipmentRepositoryAsync;
            _mapper = mapper;
        }

        public async Task<Response<int>> Handle(MovingInput request, CancellationToken cancellationToken)
        {
            var equipment = await _erepository.GetByIdAsync(request.EquipmentId);

            if (equipment == null)
                throw new ApiException($"Оборудование с ИД \"{request.EquipmentId}\" не найдено.");

            var dto = _mapper.Map<DTOs.Equipment.MovingDto>(request);
            var bases = _mapper.Map<Domain.Entities.Equipment.Moving>(dto);
            
            equipment.DepartmentId = request.NextDepartmentId;
            equipment.LocationId= request.NextLocationId;

            await _erepository.UpdateAsync(equipment);
            await _repository.AddAsync(bases);

            return new Response<int>(bases.Id);
        }
    }
}
