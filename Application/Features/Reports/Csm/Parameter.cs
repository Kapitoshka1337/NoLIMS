using Application.Filters;
using System.Collections.Generic;

namespace Application.Features.Reports.Csm
{
    public class Parameter : RequestParameter 
    {
        public IList<int> EquipmentId { get; set; }
        public string Client { get; set; }
        public string NumberOrder { get; set; }
    }
}
