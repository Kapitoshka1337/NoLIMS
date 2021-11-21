namespace Infrastructure.Identity.Models.Permisson
{
    public static class Permissionss
    {
        public static class Roles
        {
            public const int Id = 1;
            public const string Resource = "administrator";
            public const string Add = "roles.add";
            public const string Edit = "roles.edit";
            public const string Delete = "roles.delete";
            public const string View = "roles.view";
        }

        public static class Permissions
        {
            public const int Id = 2;
            public const string Resource = "administrator";
            public const string Add = "permissions.add";
            public const string Edit = "permissions.edit";
            public const string Delete = "permissions.delete";
            public const string View = "permissions.view";
        }

        public static class UserRole
        {
            public const int Id = 3;
            public const string Resource = "administrator";
            public const string Add = "userrole.add";
            public const string Edit = "userrole.edit";
            public const string Delete = "userrole.delete";
            public const string View = "userrole.view";
        }

        public static class User
        {
            public const int Id = 4;
            public const string Resource = "user";
            public const string Add = "user.add";
            public const string Edit = "user.edit";
            public const string Delete = "user.delete";
            public const string View = "user.view";
        }

        public static class Equipment
        {
            public const int Id = 5;
            public const string Resource = "equipment";
            public const string Add = "equipment.add";
            public const string Edit = "equipment.edit";
            public const string Delete = "equipment.delete";
            public const string View = "equipment.view";
        }
        public static class Verification
        {
            public const int Id = 6;
            public const string Resource = "equipment";
            public const string Add = "verification.add";
            public const string Edit = "verification.edit";
            public const string Delete = "verification.delete";
            public const string View = "verification.view";
            public const string Play = "verification.play";
            public const string Return = "verification.return";
            public const string Reset = "verification.reset";
        }

        public static class DocumentKind
        {
            public const int Id = 7;
            public const string Resource = "equipment";
            public const string Add = "documentkind.add";
            public const string Edit = "documentkind.edit";
            public const string Delete = "documentkind.delete";
            public const string View = "documentkind.view";
        }

        public static class Manufacturer
        {
            public const int Id = 8;
            public const string Resource = "equipment";
            public const string Add = "manufacturer.add";
            public const string Edit = "manufacturer.edit";
            public const string Delete = "manufacturer.delete";
            public const string View = "manufacturer.view";
        }

        public static class Department
        {
            public const int Id = 9;
            public const string Resource = "base";
            public const string Add = "department.add";
            public const string Edit = "department.edit";
            public const string Delete = "department.delete";
            public const string View = "department.view";
        }

        public static class Location
        {
            public const int Id = 10;
            public const string Resource = "base";
            public const string Add = "location.add";
            public const string Edit = "location.edit";
            public const string Delete = "location.delete";
            public const string View = "location.view";
        }

        public static class Instruction
        {
            public const int Id = 11;
            public const string Resource = "equipment";
            public const string Add = "instruction.add";
            public const string Edit = "instruction.edit";
            public const string Delete = "instruction.delete";
            public const string View = "instruction.view";
        }

        public static class File
        {
            public const int Id = 12;
            public const string Resource = "equipment";
            public const string Add = "file.add";
            public const string Edit = "file.edit";
            public const string Delete = "file.delete";
            public const string View = "file.view";
        }

        public static class Checks
        {
            public const int Id = 13;
            public const string Resource = "equipment";
            public const string Add = "checks.add";
            public const string Edit = "checks.edit";
            public const string Delete = "checks.delete";
            public const string View = "checks.view";
        }

        public static class Type
        {
            public const int Id = 14;
            public const string Resource = "equipment";
            public const string Add = "type.add";
            public const string Edit = "type.edit";
            public const string Delete = "type.delete";
            public const string View = "type.view";
        }

        public static class Index
        {
            public const int Id = 15;
            public const string Resource = "index";
            public const string loginView = "login.view";
            public const string userView = "user.view";
        }

        public static class Login
        {
            public const int Id = 16;
            public const string Resource = "login";
            public const string indexView = "index.view";
        }

        public static class UserAdmin
        {
            public const int Id = 17;
            public const string Resource = "administrator";
            public const string Add = "user.add";
            public const string Edit = "user.edit";
            public const string Delete = "user.delete";
            public const string View = "user.view";
        }

        public static class Moving
        {
            public const int Id = 18;
            public const string Resource = "equipment";
            public const string Add = "moving.add";
            public const string Edit = "moving.edit";
            public const string Delete = "moving.delete";
            public const string View = "moving.view";
        }
    }
}
