using Application.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Reports.CheckTable
{
    public class QueryCheck : IRequest<string>
    {
        public IList<int> EquipmentId { get; set; }
    }

    public class QueryCheckHandler : IRequestHandler<QueryCheck, string>
    {
        private readonly IReportServices _services;

        public QueryCheckHandler(IReportServices services)
        {
            _services = services;
        }

        public async Task<string> Handle(QueryCheck request, CancellationToken cancellationToken)
        {
            var impl = string.Join(",", request.EquipmentId);   
            var parameter = new Dictionary<string, string>();
            parameter.Add("EquipmentId", $"\"Equipment\".\"Id\" IN ({impl})");

            return await _services.Run("CheckTable.pdf", parameter, "Таблица поверок");
        }
    }
}
