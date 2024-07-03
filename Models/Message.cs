using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string message { get; set; }=string.Empty;
        public DateTime sendAt { get; set;}= DateTime.Now;

        public int? fromUserId { get; set; }//Navigation
        public User? fromUser { get; set; }

         public int? toUserId { get; set; }//Navigation
        public User? toUser { get; set;}
    }
}