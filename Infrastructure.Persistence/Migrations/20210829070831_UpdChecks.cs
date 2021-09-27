using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdChecks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DocumentKindId",
                table: "Checks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Checks_DocumentKindId",
                table: "Checks",
                column: "DocumentKindId");

            migrationBuilder.AddForeignKey(
                name: "FK_Checks_DocumentKinds_DocumentKindId",
                table: "Checks",
                column: "DocumentKindId",
                principalTable: "DocumentKinds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checks_DocumentKinds_DocumentKindId",
                table: "Checks");

            migrationBuilder.DropIndex(
                name: "IX_Checks_DocumentKindId",
                table: "Checks");

            migrationBuilder.DropColumn(
                name: "DocumentKindId",
                table: "Checks");
        }
    }
}
