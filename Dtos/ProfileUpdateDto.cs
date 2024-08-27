using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class ProfileUpdateDto
    {
        public string Label { get; set; } = string.Empty;
        public ICollection<int> MenusIds { get; set; } = new List<int>();
    }
}