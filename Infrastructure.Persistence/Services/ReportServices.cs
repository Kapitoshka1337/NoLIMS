using Application.Interfaces;
using JasperServer.Client.Core;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Services
{
    public class ReportServices : IReportServices
    {
        JasperserverRestClient client = null;
        IConfigurationRoot config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

        public async Task<string> Run(string reportUri, Dictionary<string, string> parameter, string reportName)
        {
            var jreport = config.GetSection("JasperReport");
            var jlogin = jreport.GetSection("login");
            var jpassword = jreport.GetSection("password");
            var jurl = jreport.GetSection("uri");

            client = new JasperserverRestClient(jlogin.Value, jpassword.Value, jurl.Value);

            if (!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "uploads\\generated")))
                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "uploads\\generated"));

            var hash = $"{reportName}_{parameter["EquipmentId"]}".GetHashCode();

            client.SaveToFile($"/reports/{reportUri}", parameter, $"uploads/generated/{hash}.pdf");

            if (File.Exists(Path.Combine(Directory.GetCurrentDirectory(), $"uploads\\generated\\{hash}.pdf")))
                return $"{hash}.pdf";

            return string.Empty;
        }
    }
}
