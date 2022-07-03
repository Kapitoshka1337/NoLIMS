using Application.Exceptions;
using Application.Interfaces.Repositories.User;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.User.Update
{
    public class DeleteUser : IRequest<Response<bool>> 
    {
        public int UserId { get; set; }
    }

    public class DeleteUserHandler : IRequestHandler<DeleteUser, Response<bool>>
    {
        private readonly IApplicationUserRepository _repository;
        private readonly IMapper _mapper;

        public DeleteUserHandler(IApplicationUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<Response<bool>> Handle(DeleteUser command, CancellationToken cancellationToken)
        {
            var user = await _repository.GetByIdAsync(command.UserId);

            if (user == null)
                throw new ApiException($"Пользователь с ИД \"{command.UserId}\" не найден.");

            await _repository.DeleteAsync(user);

            return new Response<bool>(true);
        }
    }
}
