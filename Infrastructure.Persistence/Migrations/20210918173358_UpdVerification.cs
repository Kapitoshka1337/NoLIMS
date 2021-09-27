using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdVerification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Verifications_VerificationStatus_StatusId",
                table: "Verifications");

            migrationBuilder.AlterColumn<int>(
                name: "StatusId",
                table: "Verifications",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Verifications_VerificationStatus_StatusId",
                table: "Verifications",
                column: "StatusId",
                principalTable: "VerificationStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Verifications_VerificationStatus_StatusId",
                table: "Verifications");

            migrationBuilder.AlterColumn<int>(
                name: "StatusId",
                table: "Verifications",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Verifications_VerificationStatus_StatusId",
                table: "Verifications",
                column: "StatusId",
                principalTable: "VerificationStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
