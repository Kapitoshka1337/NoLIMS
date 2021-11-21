using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdMoving : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Movings_CurrentLocationId",
                table: "Movings",
                column: "CurrentLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Movings_NextLocationId",
                table: "Movings",
                column: "NextLocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movings_Locations_CurrentLocationId",
                table: "Movings",
                column: "CurrentLocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Movings_Locations_NextLocationId",
                table: "Movings",
                column: "NextLocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movings_Locations_CurrentLocationId",
                table: "Movings");

            migrationBuilder.DropForeignKey(
                name: "FK_Movings_Locations_NextLocationId",
                table: "Movings");

            migrationBuilder.DropIndex(
                name: "IX_Movings_CurrentLocationId",
                table: "Movings");

            migrationBuilder.DropIndex(
                name: "IX_Movings_NextLocationId",
                table: "Movings");
        }
    }
}
