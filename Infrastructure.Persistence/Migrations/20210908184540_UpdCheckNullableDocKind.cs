using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdCheckNullableDocKind : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checks_DocumentKinds_DocumentKindId",
                table: "Checks");

            migrationBuilder.AlterColumn<int>(
                name: "DocumentKindId",
                table: "Checks",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Checks_DocumentKinds_DocumentKindId",
                table: "Checks",
                column: "DocumentKindId",
                principalTable: "DocumentKinds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checks_DocumentKinds_DocumentKindId",
                table: "Checks");

            migrationBuilder.AlterColumn<int>(
                name: "DocumentKindId",
                table: "Checks",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Checks_DocumentKinds_DocumentKindId",
                table: "Checks",
                column: "DocumentKindId",
                principalTable: "DocumentKinds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
