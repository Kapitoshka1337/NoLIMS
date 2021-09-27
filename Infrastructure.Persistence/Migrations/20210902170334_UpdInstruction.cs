using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdInstruction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "File",
                table: "Instructions");

            migrationBuilder.AddColumn<int>(
                name: "FileId",
                table: "Instructions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Instructions_FileId",
                table: "Instructions",
                column: "FileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Instructions_Files_FileId",
                table: "Instructions",
                column: "FileId",
                principalTable: "Files",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Instructions_Files_FileId",
                table: "Instructions");

            migrationBuilder.DropIndex(
                name: "IX_Instructions_FileId",
                table: "Instructions");

            migrationBuilder.DropColumn(
                name: "FileId",
                table: "Instructions");

            migrationBuilder.AddColumn<string>(
                name: "File",
                table: "Instructions",
                type: "text",
                nullable: true);
        }
    }
}
