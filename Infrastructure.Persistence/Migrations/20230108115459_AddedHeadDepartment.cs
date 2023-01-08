using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class AddedHeadDepartment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HeadDepartmentId",
                table: "Departments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_HeadDepartmentId",
                table: "Departments",
                column: "HeadDepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Departments_HeadDepartmentId",
                table: "Departments",
                column: "HeadDepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Departments_HeadDepartmentId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_HeadDepartmentId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "HeadDepartmentId",
                table: "Departments");
        }
    }
}
