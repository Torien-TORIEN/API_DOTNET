using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.Models
{
    public class Profile
    {
        public int Id { get; set; }
        public string label { get; set; } = String.Empty;
        public DateTime createdAt { get; set; } = DateTime.Now;

        // Many-to-Many relationship
        public ICollection<Menu> Menus { get; set; } = new List<Menu>();
    }
}