using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Dtos
{
    public class ProfileResponseDto
    {
        public int Id { get; set; }
        public string Label { get; set; } = String.Empty;
        public ICollection<MenuResponseDto> Menus { get; set; } = new List<MenuResponseDto>();
    }
}