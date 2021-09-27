using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdEquipmentNullableInstruction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment");

            migrationBuilder.AlterColumn<int>(
                name: "InstructionId",
                table: "Equipment",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment",
                column: "InstructionId",
                principalTable: "Instructions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment");

            migrationBuilder.AlterColumn<int>(
                name: "InstructionId",
                table: "Equipment",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment",
                column: "InstructionId",
                principalTable: "Instructions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
