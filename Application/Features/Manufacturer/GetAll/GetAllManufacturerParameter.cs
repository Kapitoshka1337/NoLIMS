using Application.Filters;

namespace Application.Features.Manufacturer.GetAll
{
    public class GetAllManufacturerParameter : RequestParameter
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }

}
