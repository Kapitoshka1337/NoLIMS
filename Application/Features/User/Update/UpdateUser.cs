using Application.Exceptions;
using Application.Interfaces.Repositories.Equipment;
using Application.Interfaces.Repositories.User;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.User.Update
{
    public class UpdateUser : IRequest<Response<bool>> 
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public int DepartmentId { get; set; }
    }

    public class UpdateUserHandler : IRequestHandler<UpdateUser, Response<bool>>
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UpdateUserHandler(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(UpdateUser command, CancellationToken cancellationToken)
        {
            var user = await _repository.GetByIdAsync(command.Id);

            if (user == null)
                throw new ApiException($"Пользователь с ИД \"{command.Id}\" не найден.");

            user.FirstName = command.FirstName;
            user.MiddleName = command.MiddleName;
            user.LastName = command.LastName;
            user.DepartmentId = command.DepartmentId;

            await _repository.UpdateAsync(user);

            return new Response<bool>(true);
        }
    }
}
