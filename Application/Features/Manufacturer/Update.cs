using Application.Exceptions;
using Application.Features.Manufacturer.GetAll;
using Application.Interfaces.Repositories.Equipment;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Manufacturer.Update
{
    public class UpdateManufacturer : IRequest<Response<GetAllManufacturerViewModel>> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }

    public class UpdateManufacturerHandler : IRequestHandler<UpdateManufacturer, Response<GetAllManufacturerViewModel>>
    {
        private readonly IManufacturerRepository _repository;
        private readonly IMapper _mapper;

        public UpdateManufacturerHandler(IManufacturerRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<GetAllManufacturerViewModel>> Handle(UpdateManufacturer command, CancellationToken cancellationToken)
        {
            var item = await _repository.GetByIdAsync(command.Id);
            var itemViewModel = _mapper.Map<GetAllManufacturerViewModel>(item);

            if (item == null)
            {
                string msg = $"Производитель с ИД \"{command.Id}\" не найден.";
                Response<GetAllManufacturerViewModel> rsp = new Response<GetAllManufacturerViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            item.Name = command.Name;
            item.Country= command.Country;
            item.City = command.City;

            await _repository.UpdateAsync(item);

            return new Response<GetAllManufacturerViewModel>(itemViewModel);
        }
    }
}
