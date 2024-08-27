using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class MenuAddDto
    {
        public string Label { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public Boolean IsReadOnly { get; set;} = false;
    }
}