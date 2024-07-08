using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class PostAddDto
    {
        public string Comment { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int? UserId { get; set; }
        
    }
}