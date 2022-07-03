using Application.Interfaces.Repositories.Storage;
using AutoMapper;
using Domain.Entities.Storage;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Base.Storage.Export
{
    public class ExportQuery : IRequest<File>
    {
        public string Table { get; set; }
        public List<string> Columns { get; set; }
    }

    public class ExportQueryHandler : IRequestHandler<ExportQuery, File>
    {
        //private readonly IFileRepository _repository;
        private readonly IServiceProvider _serviceProvider;
        //private readonly IServiceCollection _serviceCollection;
        private readonly IMapper _mapper;

        public ExportQueryHandler(IMapper mapper, IServiceProvider serviceProvider)
        {
            //_repository = repository;
            _serviceProvider = serviceProvider;
            //_serviceCollection = serviceCollection;
            _mapper = mapper;
        }

        public async Task<File> Handle(ExportQuery request, CancellationToken cancellationToken)
        {
            // Нашли сборку Application, в которой хранятся интерфейсы репозитория
            System.Reflection.Assembly applicationAssembly = System.AppDomain.CurrentDomain.GetAssemblies().Where(a => string.Equals(a.ManifestModule.Name, "Application.dll"))?.FirstOrDefault();
            System.Reflection.Assembly domainAssembly = System.AppDomain.CurrentDomain.GetAssemblies().Where(a => string.Equals(a.ManifestModule.Name, "Domain.dll"))?.FirstOrDefault();

            //if (assemblies.Any())
            //{
                // Если сборка найдена то ищем интерфейс репозитория
                //System.Reflection.Assembly applicationAssembly = assemblies.Where(a => a.ManifestModule.Name == "Application.dll")?.FirstOrDefault();
                //System.Reflection.Assembly domainAssembly = assemblies.Where(a => a.ManifestModule.Name == "Domain.dll")?.FirstOrDefault();
                var exportedRepositoryType = applicationAssembly.GetExportedTypes().Where(e => string.Equals(e.Name, $"I{request.Table}Repository"));
                var exportedEntityType = domainAssembly.GetExportedTypes().Where(e => string.Equals(e.Name, request.Table));

                var entity = Activator.CreateInstance(exportedEntityType.FirstOrDefault());

                //if (exportedRepositoryType != null)
                //{
                    System.Type repositoryType = System.Type.GetType(exportedRepositoryType.FirstOrDefault().FullName);
                    var repository = _serviceProvider.GetService(repositoryType);

                // input parameter "o"
                var xParameter = Expression.Parameter(exportedEntityType.FirstOrDefault(), "o");

                // new statement "new Data()"
                var xNew = Expression.New(exportedEntityType.FirstOrDefault());

                // create initializers
                var bindings = request.Columns.Select(o => o.Trim())
                    .Select(o =>
                    {
                            // property "Field1"
                            var mi = exportedEntityType.FirstOrDefault().GetProperty(o);

                            // original value "o.Field1"
                            var xOriginal = Expression.Property(xParameter, mi);

                            // set value "Field1 = o.Field1"
                            return Expression.Bind(mi, xOriginal);
                    }
                );

                // initialization "new Data { Field1 = o.Field1, Field2 = o.Field2 }"
                var xInit = Expression.MemberInit(xNew, bindings);

                // expression "o => new Data { Field1 = o.Field1, Field2 = o.Field2 }"
                //var lambda = Expression.Lambda<Func<T, T>>(xInit, xParameter);

                // compile to Func<Data, Data>
                //return lambda.Compile();
            //}
            //}

            return null;
        }
    }
}
