using System.Collections.Generic;

namespace Application.Features.Base.Storage.Export
{
    public class ExportParameter
    {
        public string Table { get; set; }
        public List<string> Columns { get; set; }
    }
}
