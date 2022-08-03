using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class JoinEquipment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Characteristics",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "EquipmentIO_Accuracy",
                table: "Equipment");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Characteristics",
                table: "Equipment",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Equipment",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EquipmentIO_Accuracy",
                table: "Equipment",
                type: "text",
                nullable: true);
        }
    }
}
