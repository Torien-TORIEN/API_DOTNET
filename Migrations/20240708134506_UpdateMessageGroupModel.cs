using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMessageGroupModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "groupId",
                table: "Messages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isForGroup",
                table: "Messages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "toGroupId",
                table: "Messages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "creatorId",
                table: "Groups",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_groupId",
                table: "Messages",
                column: "groupId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_creatorId",
                table: "Groups",
                column: "creatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Users_creatorId",
                table: "Groups",
                column: "creatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Groups_groupId",
                table: "Messages",
                column: "groupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Users_creatorId",
                table: "Groups");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Groups_groupId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_groupId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Groups_creatorId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "groupId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "isForGroup",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "toGroupId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "creatorId",
                table: "Groups");
        }
    }
}
