using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class PostResponseDto
    {
        public int Id { get; set; }
        public string Comment { get; set; } = String.Empty;
        public int  Likes { get; set; }
        public int  Dislikes { get; set; }
        public string Image { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set;}= DateTime.Now;
        public int? UserId { get; set; }
        //public User? owner { get; set;}
    }
}