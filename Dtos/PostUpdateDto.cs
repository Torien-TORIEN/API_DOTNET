using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class PostUpdateDto
    {
        public string Comment { get; set; } = string.Empty;
        public int Likes { get; set; }
    }
}