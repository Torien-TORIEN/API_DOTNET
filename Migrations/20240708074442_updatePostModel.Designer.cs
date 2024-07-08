﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using api.Data;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(ApplicationDBContext))]
    [Migration("20240708074442_updatePostModel")]
    partial class updatePostModel
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("api.Models.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("fromUserId")
                        .HasColumnType("int");

                    b.Property<string>("message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("sendAt")
                        .HasColumnType("datetime2");

                    b.Property<int?>("toUserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("fromUserId");

                    b.HasIndex("toUserId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("api.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("comment")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("dislikes")
                        .HasColumnType("int");

                    b.Property<string>("image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("likes")
                        .HasColumnType("int");

                    b.Property<int?>("userId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("userId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("api.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("api.Models.Message", b =>
                {
                    b.HasOne("api.Models.User", "fromUser")
                        .WithMany()
                        .HasForeignKey("fromUserId");

                    b.HasOne("api.Models.User", "toUser")
                        .WithMany()
                        .HasForeignKey("toUserId");

                    b.Navigation("fromUser");

                    b.Navigation("toUser");
                });

            modelBuilder.Entity("api.Models.Post", b =>
                {
                    b.HasOne("api.Models.User", "owner")
                        .WithMany()
                        .HasForeignKey("userId");

                    b.Navigation("owner");
                });
#pragma warning restore 612, 618
        }
    }
}
