using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdateEquipment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Movings_EquipmentId",
                table: "Movings",
                column: "EquipmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movings_Equipment_EquipmentId",
                table: "Movings",
                column: "EquipmentId",
                principalTable: "Equipment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movings_Equipment_EquipmentId",
                table: "Movings");

            migrationBuilder.DropIndex(
                name: "IX_Movings_EquipmentId",
                table: "Movings");
        }
    }
}
