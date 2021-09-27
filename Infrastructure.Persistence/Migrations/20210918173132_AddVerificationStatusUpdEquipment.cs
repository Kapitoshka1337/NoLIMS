using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Infrastructure.Persistence.Migrations
{
    public partial class AddVerificationStatusUpdEquipment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment");

            migrationBuilder.DropIndex(
                name: "IX_Equipment_InstructionId",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "DateEnter",
                table: "Verifications");

            migrationBuilder.DropColumn(
                name: "DateRecovery",
                table: "Verifications");

            migrationBuilder.DropColumn(
                name: "DateSent",
                table: "Verifications");

            migrationBuilder.DropColumn(
                name: "NumberTicket",
                table: "Verifications");

            migrationBuilder.DropColumn(
                name: "InstructionId",
                table: "Equipment");

            migrationBuilder.AddColumn<int>(
                name: "StatusId",
                table: "Verifications",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VerificationStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerificationStatus", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Verifications_StatusId",
                table: "Verifications",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Verifications_VerificationStatus_StatusId",
                table: "Verifications",
                column: "StatusId",
                principalTable: "VerificationStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Verifications_VerificationStatus_StatusId",
                table: "Verifications");

            migrationBuilder.DropTable(
                name: "VerificationStatus");

            migrationBuilder.DropIndex(
                name: "IX_Verifications_StatusId",
                table: "Verifications");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "Verifications");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateEnter",
                table: "Verifications",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateRecovery",
                table: "Verifications",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateSent",
                table: "Verifications",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "NumberTicket",
                table: "Verifications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstructionId",
                table: "Equipment",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_InstructionId",
                table: "Equipment",
                column: "InstructionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Instructions_InstructionId",
                table: "Equipment",
                column: "InstructionId",
                principalTable: "Instructions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
