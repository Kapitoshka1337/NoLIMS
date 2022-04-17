using Application.Interfaces.Repositories.User;
using Application.Wrappers;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.User.GetAll;
using Application.Exceptions;

namespace Application.Features.User.GetById
{
    public class QueryById : IRequest<Response<ViewModel>>
    {
        public int Id { get; set; }
    }

    public class QueryByIdHandler : IRequestHandler<QueryById, Response<ViewModel>>
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public QueryByIdHandler(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Response<ViewModel>> Handle(QueryById request, CancellationToken cancellationToken)
        {
            //var validFilter = _mapper.Map<Parameter>(request);
            var item = await _repository.GetByIdAsync(request.Id);
            var viewModel = _mapper.Map<ViewModel>(item);

            if (item == null)
            {
                string msg = $"Пользователь с ИД \"{request.Id}\" не найден.";
                Response<ViewModel> rsp = new Response<ViewModel>();
                rsp.Succeeded = false;
                rsp.Message = msg;

                return rsp;
            }

            return new Response<ViewModel>(viewModel);
        }
    }
}
