using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string username { get; set; } = String.Empty;
        public string  email { get; set; }= String.Empty; 

        public string  password { get; set; }= String.Empty; 

        // Many-to-Many relationship
        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}