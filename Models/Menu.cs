using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string label { get; set; } = String.Empty;
        public string path { get; set; } = String.Empty;
        public Boolean isReadOnly { get; set;}
        public DateTime createdAt { get; set; } = DateTime.Now;
    }
}