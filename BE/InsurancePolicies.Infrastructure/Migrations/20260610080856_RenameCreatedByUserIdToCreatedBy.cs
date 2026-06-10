using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsurancePolicies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameCreatedByUserIdToCreatedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "Clients",
                newName: "CreatedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Clients",
                newName: "CreatedByUserId");
        }
    }
}
