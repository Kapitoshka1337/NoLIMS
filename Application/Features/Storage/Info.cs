using Application.Interfaces.Repositories.Storage;
using AutoMapper;
using Domain.Entities.Storage;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.Base.Storage.GetAll;

namespace Application.Features.Base.Storage
{
    public class Info : IRequest<ViewModel>
    {
        public int FileId { get; set; }
        public string Host { get; set; }
    }

    public class InfoHandler : IRequestHandler<Info, ViewModel>
    {
        private readonly IFileRepository _repository;
        private readonly IMapper _mapper;

        public InfoHandler(IFileRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ViewModel> Handle(Info request, CancellationToken cancellationToken)
        {
            var file = await _repository.GetByIdAsync(request.FileId);
            ViewModel vm = new ViewModel();

            vm.Uid = file.Id.ToString();
            vm.Size = file.Size.ToString();
            vm.Name = file.Hash;
            vm.Url = string.Format("{0}?FileId={1}", request.Host, file.Id);
            vm.Preview = false;
            vm.Status = "success";

            return vm;
        }
    }
}
