using Application.Filters;
using System.Collections.Generic;

namespace Application.Features.Reports.Stricker
{
    public class Parameter : RequestParameter 
    {
        public IList<int> EquipmentId { get; set; }
    }
}
