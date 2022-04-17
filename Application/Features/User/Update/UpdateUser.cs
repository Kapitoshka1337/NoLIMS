using Application.Exceptions;
using Application.Features.User.GetAll;
using Application.Interfaces.Repositories.Equipment;
using Application.Interfaces.Repositories.User;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.User.Update
{
    public class UpdateUser : IRequest<Response<ViewModel>> 
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public int DepartmentId { get; set; }
    }

    public class UpdateUserHandler : IRequestHandler<UpdateUser, Response<ViewModel>>
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UpdateUserHandler(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<ViewModel>> Handle(UpdateUser command, CancellationToken cancellationToken)
        {
            var item = await _repository.GetByIdAsync(command.Id);
            var itemViewModel = _mapper.Map<ViewModel>(item);

            if (item == null)
            {
                string msg = $"Пользователь с ИД \"{command.Id}\" не найден.";
                Response<ViewModel> rsp = new Response<ViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            item.FirstName = command.FirstName;
            item.MiddleName = command.MiddleName;
            item.LastName = command.LastName;
            item.DepartmentId = command.DepartmentId;

            await _repository.UpdateAsync(item);

            return new Response<ViewModel>(itemViewModel);
        }
    }
}
