using Application.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Reports.Stricker
{
    public class Query : IRequest<string>
    {
        public IList<int> EquipmentId { get; set; }
    }

    public class QueryHandler : IRequestHandler<Query, string>
    {
        private readonly IReportServices _services;

        public QueryHandler(IReportServices services)
        {
            _services = services;
        }

        public async Task<string> Handle(Query request, CancellationToken cancellationToken)
        {
            var impl = string.Join(",", request.EquipmentId);   
            var parameter = new Dictionary<string, string>();
            parameter.Add("EquipmentId", $"\"Equipment\".\"Id\" IN ({impl})");

            return await _services.Run("Sticker_Report.pdf", parameter, "Этикетка");
        }
    }
}
