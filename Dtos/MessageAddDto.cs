using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class MessageAddDto
    {
        public string Message { get; set; } = string.Empty;
        public int FromUserId { get; set; }
        public Boolean IsForGroup{ get; set;}
        public int? toGroupId { get; set; }
        public int? ToUserId { get; set; }
    }
}