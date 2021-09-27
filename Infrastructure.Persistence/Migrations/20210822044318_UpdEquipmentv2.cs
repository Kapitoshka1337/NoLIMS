using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdEquipmentv2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Departments_DepartmentId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Locations_LocationId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Manufacturers_ManufacturerId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Types_TypeId",
                table: "Equipment");

            migrationBuilder.AlterColumn<int>(
                name: "TypeId",
                table: "Equipment",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ManufacturerId",
                table: "Equipment",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "Equipment",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "InstructionId",
                table: "Equipment",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "Equipment",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Departments_DepartmentId",
                table: "Equipment",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment",
                column: "InstructionId",
                principalTable: "Instructions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Locations_LocationId",
                table: "Equipment",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Manufacturers_ManufacturerId",
                table: "Equipment",
                column: "ManufacturerId",
                principalTable: "Manufacturers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Types_TypeId",
                table: "Equipment",
                column: "TypeId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Departments_DepartmentId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Locations_LocationId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Manufacturers_ManufacturerId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Types_TypeId",
                table: "Equipment");

            migrationBuilder.AlterColumn<int>(
                name: "TypeId",
                table: "Equipment",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "ManufacturerId",
                table: "Equipment",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "Equipment",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "InstructionId",
                table: "Equipment",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "Equipment",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Departments_DepartmentId",
                table: "Equipment",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment",
                column: "InstructionId",
                principalTable: "Instructions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Locations_LocationId",
                table: "Equipment",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Manufacturers_ManufacturerId",
                table: "Equipment",
                column: "ManufacturerId",
                principalTable: "Manufacturers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Types_TypeId",
                table: "Equipment",
                column: "TypeId",
                principalTable: "Types",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
