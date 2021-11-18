using Application.Filters;

namespace Application.Features.Verification.GetAllVerification
{
    public class GetAllVerificationParameter : RequestParameter
    {
        public string EquipmentName { get; set; }
        public string EquipmentModel { get; set; }
        public string EquipmentSerialNumber { get; set; }
        public int StatusId { get; set; }
        public int DepartmentId { get; set; }
    }
}
