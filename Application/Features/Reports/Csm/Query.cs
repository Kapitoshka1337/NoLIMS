using Application.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Reports.Csm
{
    public class QueryCsm : IRequest<string>
    {
        public IList<int> EquipmentId { get; set; }
        public string Client { get; set; }
        public string NumberOrder { get; set; }
    }

    public class QueryCsmHandler : IRequestHandler<QueryCsm, string>
    {
        private readonly IReportServices _services;

        public QueryCsmHandler(IReportServices services)
        {
            _services = services;
        }

        public async Task<string> Handle(QueryCsm request, CancellationToken cancellationToken)
        {
            var impl = string.Join(",", request.EquipmentId);   
            var parameter = new Dictionary<string, string>();
            parameter.Add("EquipmentId", $"\"Equipment\".\"Id\" IN ({impl})");
            parameter.Add("Client", request.Client);
            parameter.Add("NumberOrder", request.NumberOrder);

            return await _services.Run("CSM.pdf", parameter, "Заявка в ЦСМ");
        }
    }
}
