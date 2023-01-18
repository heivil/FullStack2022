using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace cs_backend.Migrations
{
    public partial class initialcreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kysymykset",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    kys_nimi = table.Column<string>(type: "text", nullable: false),
                    tentti_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kysymykset", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Tentit",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten_nimi = table.Column<string>(type: "text", nullable: false),
                    tentti_Pvm = table.Column<string>(type: "text", nullable: true),
                    min_pisteet = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tentit", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Vastaukset",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    kysymys_id = table.Column<int>(type: "integer", nullable: false),
                    vas_nimi = table.Column<string>(type: "text", nullable: false),
                    pisteet = table.Column<int>(type: "integer", nullable: false),
                    onko_oikein = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vastaukset", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kysymykset");

            migrationBuilder.DropTable(
                name: "Tentit");

            migrationBuilder.DropTable(
                name: "Vastaukset");
        }
    }
}
