using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class MessageResponseDto
    {
        public int Id { get; set; }
        public string Message { get; set; }=string.Empty;
        public DateTime SendAt { get; set;}
        public Boolean IsForGroup{ get; set;}
        public int? FromUserId { get; set; }//Navigation
        public int? ToUserId { get; set; }//Navigation
        public int? ToGroupId { get; set; }//Navigation
    }
}