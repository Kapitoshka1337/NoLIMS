using Application.Interfaces;
using Application.Interfaces.Repositories.User;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.User
{
    public class Create : IRequest<Response<string>>
    {
        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public int DepartmentId { get; set; }
    }

    public class CreateHandler : IRequestHandler<Create, Response<string>>
    {
        //private readonly IUserRepository _repository;
        private readonly IAccountService _account;
        private readonly IMapper _mapper;
        public CreateHandler(IAccountService account, IMapper mapper)
        {
            //_repository = repository;
            _account = account;
            _mapper = mapper;
        }

        public async Task<Response<string>> Handle(Create request, CancellationToken cancellationToken)
        {
            var registerRequest = _mapper.Map<DTOs.Account.RegisterRequest>(request);
            var response = await _account.RegisterAsync(registerRequest);

            return response;
        }
    }
}
