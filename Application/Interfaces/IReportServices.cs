using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IReportServices
    {
        Task<string> Run(string reportUri, Dictionary<string, string> parameter, string reportName);
    }
}
