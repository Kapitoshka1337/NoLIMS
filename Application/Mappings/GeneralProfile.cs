using Application.Features.Base.Department;
using Application.Features.Base.Location;
using Application.Features.Check;
using Application.Features.Check.GetAll;
using Application.Features.DocumentKind;
using Application.Features.DocumentKind.GetAll;
using Application.Features.Equipment.Commands;
using Application.Features.Equipment.Commands.CreateEquipment;
using Application.Features.Equipment.Commands.UpdateCommand;
using Application.Features.Equipment.Queries.GetAllEquipment;
using Application.Features.Equipment.Queries.GetEquipmentById;
using Application.Features.Instruction;
using Application.Features.Manufacturer;
using Application.Features.Manufacturer.GetAll;
using Application.Features.Moving;
using Application.Features.Role.Grant;
using Application.Features.Storage;
using Application.Features.Verification;
using Application.Features.Verification.GetAllVerification;
using AutoMapper;
using Domain.Entities.Base;
using Domain.Entities.Equipment;
using Domain.Entities.Role;
using Domain.Entities.Storage;
namespace Application.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
            AllowNullCollections = true;

            // Общие сущности. DTO -> Domain
            CreateMap<Application.DTOs.Base.BusinessUnit, Domain.Entities.Base.BusinessUnit>();
            CreateMap<Application.DTOs.Base.Department, Domain.Entities.Base.Department>();
            CreateMap<Application.DTOs.Base.Location, Domain.Entities.Base.Location>();

            // Общие сущности. Domain -> DTO
            CreateMap<Domain.Entities.Base.BusinessUnit, Application.DTOs.Base.BusinessUnit>();
            CreateMap<Domain.Entities.Base.Department, Application.DTOs.Base.Department>();
            CreateMap<Domain.Entities.Base.Location, Application.DTOs.Base.Location>();

            // Оборудование. DTO -> Domain
            CreateMap<CreateEquipmentCommand, Application.DTOs.Equipment.Equipment>();
            CreateMap<CreateVO, Application.DTOs.Equipment.EquipmentVO>();
            CreateMap<CreateIO, Application.DTOs.Equipment.EquipmentIO>();
            CreateMap<CreateCI, Application.DTOs.Equipment.EquipmentCI>();
            CreateMap<UpdateEquipmentCommand, Domain.Entities.Equipment.Equipment>()
                .ForMember(dest => dest.DateCreate, opt => opt.MapFrom(src => src.DateCreate.Value.ToLocalTime()))
                .ForMember(dest => dest.DateCommissioning, opt => opt.MapFrom(src => src.DateCommissioning.Value.ToLocalTime()))
                .ReverseMap();
            //CreateMap<UpdateEquipmentCommand, Domain.Entities.Equipment.EquipmentVO>();
            //CreateMap<UpdateEquipmentCommand, Domain.Entities.Equipment.EquipmentIO>();
            //CreateMap<UpdateEquipmentCommand, Domain.Entities.Equipment.EquipmentCI>();
            CreateMap<Application.DTOs.Equipment.Equipment, Domain.Entities.Equipment.Equipment>();
            //CreateMap<Application.DTOs.Equipment.EquipmentVO, Domain.Entities.Equipment.EquipmentVO>();
            //CreateMap<Application.DTOs.Equipment.EquipmentIO, Domain.Entities.Equipment.EquipmentIO>();
            //CreateMap<Application.DTOs.Equipment.EquipmentCI, Domain.Entities.Equipment.EquipmentCI>();
            CreateMap<Application.DTOs.Equipment.Manufacturer, Domain.Entities.Equipment.Manufacturer>();
            CreateMap<Application.DTOs.Equipment.Type, Domain.Entities.Equipment.Type>();
            CreateMap<Application.DTOs.Equipment.Status, Domain.Entities.Equipment.EquipmentStatus>();
            CreateMap<Application.DTOs.Equipment.TagsDto, Domain.Entities.Equipment.Tags>();
            CreateMap<Application.DTOs.Equipment.CheckDto, Domain.Entities.Equipment.Check>();
            CreateMap<Application.DTOs.Equipment.Instruction, Domain.Entities.Equipment.Instruction>();

            // Оборудование. Domain -> DTO
            CreateMap<Domain.Entities.Equipment.Equipment, Application.DTOs.Equipment.Equipment>();
            CreateMap<Domain.Entities.Equipment.Equipment, EquipmentDetail>();
            //CreateMap<Domain.Entities.Equipment.EquipmentVO, EquipmentDetail>();
            //CreateMap<Domain.Entities.Equipment.EquipmentIO, EquipmentDetail>();
            //CreateMap<Domain.Entities.Equipment.EquipmentCI, EquipmentDetail>();
            CreateMap<Domain.Entities.Equipment.Manufacturer, Application.DTOs.Equipment.Manufacturer>();
            CreateMap<Domain.Entities.Equipment.Tags, Application.DTOs.Equipment.TagsDto>();
            CreateMap<Domain.Entities.Equipment.Tags, Application.Features.Tags.GetAll.ViewModel>();
            CreateMap<Application.Features.Tags.GetAll.Query, Application.Features.Tags.GetAll.Parameter>();
            CreateMap<Domain.Entities.Equipment.Instruction, Application.DTOs.Equipment.Instruction>();
            CreateMap<Domain.Entities.Equipment.Check, Application.DTOs.Equipment.CheckDto>();
            CreateMap<Domain.Entities.Equipment.Check, Application.Features.Check.GetAll.ViewModel>();
            CreateMap<Domain.Entities.Equipment.Type, Application.Features.Type.GetAll.ViewModel>();
            CreateMap<Domain.Entities.Equipment.Type, Application.DTOs.Equipment.Type>();
            CreateMap<Domain.Entities.Equipment.Type, Application.Features.Type.CreateTypeCommand>().ReverseMap();
            CreateMap<Domain.Entities.Equipment.DocumentKind, Application.DTOs.Equipment.DocumentKindDto>();
            CreateMap<Domain.Entities.Equipment.Moving, Application.DTOs.Equipment.MovingDto>();

            // Оборудование. Поверки. Domain --> DTO
            CreateMap<CreateVerificationCommand, Application.DTOs.Equipment.Verification.VerificationDto>();
            CreateMap<EqVal, Application.DTOs.Equipment.Verification.VerificationDto>();
            CreateMap<Domain.Entities.Equipment.Verification.Verification, Application.DTOs.Equipment.Verification.VerificationDto>();
            CreateMap<Application.DTOs.Equipment.Verification.VerificationDto, Domain.Entities.Equipment.Verification.Verification>();
            CreateMap<GetAllVerificationQuery, GetAllVerificationParameter>().ReverseMap();
            CreateMap<Domain.Entities.Equipment.Verification.Verification, GetAllVerificationViewModel>().ReverseMap();
            
            // Поверки.
            CreateMap<PassedCommand, Domain.Entities.Equipment.Check>()
                .ForMember(dest => dest.CurrentCheck, opt => opt.MapFrom(src => src.CurrentCheck.Value.ToLocalTime()))
                .ForMember(dest => dest.NextCheck, opt => opt.MapFrom(src => src.NextCheck.Value.ToLocalTime()))
                .ReverseMap();
            CreateMap<Query, Parameter>();
            CreateMap<Application.Features.Type.GetAll.Query, Application.Features.Type.GetAll.Parameter>();
            CreateMap<Application.Features.Check.GetAll.Parameter, Application.Features.Check.GetAll.Query>().ReverseMap();
            CreateMap<Application.Features.Role.GetAll.Parameter, Application.Features.Role.GetAll.Query>().ReverseMap();
            CreateMap<Application.DTOs.Role.RoleDto, Application.Features.Role.GetAll.ViewModel>().ReverseMap();
            CreateMap<Role, Application.Features.Role.GetAll.ViewModel>().ReverseMap();

            CreateMap<GetAllEquipmentQuery, GetAllEquipmentParameter>().ReverseMap();
            CreateMap<Domain.Entities.Equipment.Equipment, GetAllEquipmentViewModel>()
                // .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department.Name))
                // .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.Name))
                // .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Manufacturer.Name))
                // .ForMember(dest => dest.Tag, opt => opt.MapFrom(src => src.Tag.Name))
                .ReverseMap();

            CreateMap<Domain.Entities.Equipment.Equipment, EqViewModel>()
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department.Name))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.Name))
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom(src => src.Manufacturer.Name))
                .ReverseMap();
            CreateMap<Domain.Entities.Equipment.Equipment, EqViewModelSearch>().ReverseMap();

            // Виды документов.
            CreateMap<CreateDocumentKindCommand, Application.DTOs.Equipment.DocumentKindDto>();
            CreateMap<Application.DTOs.Equipment.DocumentKindDto, DocumentKind>();
            CreateMap<DocumentKind, Application.DTOs.Equipment.DocumentKindDto>();
            CreateMap<GetAllDocumentKindQuery, GetAllDocumentKindParameter>();
            CreateMap<Domain.Entities.Equipment.DocumentKind, GetAllDocumentKindViewModel>().ReverseMap();

            // File.
            CreateMap<CreateFileCommand, Application.DTOs.Storage.FileDto>();
            CreateMap<Application.DTOs.Storage.FileDto, File>();

            // Производитель.
            CreateMap<CreateManufacturerCommand, Application.DTOs.Equipment.Manufacturer>();
            CreateMap<Application.DTOs.Equipment.Manufacturer, Manufacturer>();
            CreateMap<Manufacturer, Application.DTOs.Equipment.Manufacturer>();
            CreateMap<GetAllManufacturerQuery, GetAllManufacturerParameter>().ReverseMap();
            CreateMap<Domain.Entities.Equipment.Manufacturer, GetAllManufacturerViewModel>().ReverseMap();

            // Подразделения.
            CreateMap<DepartmentInput, Application.DTOs.Base.Department>();
            CreateMap<Application.DTOs.Base.Department, Department>();
            CreateMap<Department, Application.DTOs.Base.Department>();
            CreateMap<Application.Features.Base.Department.GetAll.Query, Application.Features.Base.Department.GetAll.Parameter>().ReverseMap();
            CreateMap<Domain.Entities.Base.Department, Application.Features.Base.Department.GetAll.ViewModel>().ReverseMap();

            // Местоположение.
            CreateMap<LocationInput, Application.DTOs.Base.Location>();
            CreateMap<Application.DTOs.Base.Location, Location>();
            CreateMap<Location, Application.DTOs.Base.Location>();
            CreateMap<Application.Features.Base.Location.GetAll.Query, Application.Features.Base.Location.GetAll.Parameter>().ReverseMap();
            CreateMap<Domain.Entities.Base.Location, Application.Features.Base.Location.GetAll.ViewModel>().ReverseMap();
            CreateMap<Domain.Entities.Base.Location, Application.Features.Base.Location.GetAll.ViewModelDepId>().ReverseMap();

            // Инструкции.
            CreateMap<InstructionInput, Application.DTOs.Equipment.Instruction>();
            CreateMap<InstructionUpdate, Application.DTOs.Equipment.Instruction>().ReverseMap();
            CreateMap<Application.DTOs.Equipment.Instruction, Instruction>();
            CreateMap<Instruction, Application.DTOs.Equipment.Instruction>();
            CreateMap<Application.Features.Instruction.GetAll.Query, Application.Features.Instruction.GetAll.Parameter>().ReverseMap();
            CreateMap<Domain.Entities.Equipment.Instruction, Application.Features.Instruction.GetAll.ViewModel>().ReverseMap();

            CreateMap<Grant, Application.DTOs.Role.RoleClaimDto>();
            CreateMap<Application.DTOs.Role.RoleClaimDto, Domain.Entities.Role.RoleClaim>();

            // Пользователи
            CreateMap<Application.Features.User.Create, DTOs.Account.RegisterRequest>();
            CreateMap<DTOs.Account.RegisterRequest, Domain.Entities.User.ApplicationUser>().ReverseMap();
            CreateMap<Domain.Entities.User.ApplicationUser, Application.Features.User.GetAll.ViewModel>().ReverseMap();
            CreateMap<Application.Features.User.GetAll.Query, Application.Features.User.GetAll.Parameter>().ReverseMap();

            // Перемещения.
            CreateMap<MovingInput, Application.DTOs.Equipment.MovingDto>();
            CreateMap<Application.DTOs.Equipment.MovingDto, Moving>().ReverseMap();
            CreateMap<Application.Features.Moving.GetAll.Query, Application.Features.Moving.GetAll.Parameter>().ReverseMap();
            CreateMap<Domain.Entities.Equipment.Moving, Application.Features.Moving.GetAll.ViewModel>().ReverseMap();
        }
    }
}
