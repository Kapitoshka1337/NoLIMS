using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdateMoving_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "NextDepartmentId",
                table: "Movings",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CurrentDepartmentId",
                table: "Movings",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movings_CurrentDepartmentId",
                table: "Movings",
                column: "CurrentDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Movings_NextDepartmentId",
                table: "Movings",
                column: "NextDepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movings_Departments_CurrentDepartmentId",
                table: "Movings",
                column: "CurrentDepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Movings_Departments_NextDepartmentId",
                table: "Movings",
                column: "NextDepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movings_Departments_CurrentDepartmentId",
                table: "Movings");

            migrationBuilder.DropForeignKey(
                name: "FK_Movings_Departments_NextDepartmentId",
                table: "Movings");

            migrationBuilder.DropIndex(
                name: "IX_Movings_CurrentDepartmentId",
                table: "Movings");

            migrationBuilder.DropIndex(
                name: "IX_Movings_NextDepartmentId",
                table: "Movings");

            migrationBuilder.AlterColumn<int>(
                name: "NextDepartmentId",
                table: "Movings",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "CurrentDepartmentId",
                table: "Movings",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
