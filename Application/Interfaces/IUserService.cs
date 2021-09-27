using Application.DTOs.User;
using Application.Wrappers;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<Response<UserPermissionResponse>> GetPermission(int userId);
    }
}
