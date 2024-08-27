using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class ProfileMenu
    {
        public int ProfileId { get; set; }
        public Profile Profile { get; set; }
        
        public int MenuId { get; set; }
        public Menu Menu { get; set; }
    }
}