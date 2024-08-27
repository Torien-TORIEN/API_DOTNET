using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class MenuResponseDto
    {
        public int Id { get; set; }
        public string Label { get; set; } = String.Empty;
        public string Path { get; set; } = String.Empty;
        public Boolean IsReadOnly { get; set;}
    }
}