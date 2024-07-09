using System;
using System.Collections.Generic;

namespace api.Models
{
    public class Group
    {
        public int Id { get; set; }
        public string name { get; set; } = string.Empty;
        public DateTime createdAt { get; set; } = DateTime.Now;

        public int? creatorId { get; set; }
        public User? creator { get; set; }

        // Many-to-Many relationship
        public ICollection<User> Members { get; set; } = new List<User>();
    }
}
