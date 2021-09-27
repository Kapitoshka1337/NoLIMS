using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Infrastructure.Persistence.Migrations
{
    public partial class AddFileUpdChecksDepLoc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Locations_LocationId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_LocationId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Departments");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "Locations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FileId",
                table: "Checks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Hash = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    Size = table.Column<decimal>(type: "numeric(18,6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_DepartmentId",
                table: "Locations",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Checks_FileId",
                table: "Checks",
                column: "FileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Checks_Files_FileId",
                table: "Checks",
                column: "FileId",
                principalTable: "Files",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Departments_DepartmentId",
                table: "Locations",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checks_Files_FileId",
                table: "Checks");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Departments_DepartmentId",
                table: "Locations");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropIndex(
                name: "IX_Locations_DepartmentId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Checks_FileId",
                table: "Checks");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "FileId",
                table: "Checks");

            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Departments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_LocationId",
                table: "Departments",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Locations_LocationId",
                table: "Departments",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
