using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string comment { get; set; } = String.Empty;
        public int  likes { get; set; }
        public int  dislikes { get; set; }

        public string image { get; set; } = String.Empty;
        
        public DateTime createdAt { get; set;}= DateTime.Now;

        public int? userId { get; set; }//Navigation
        public User? owner { get; set;}

    }
}