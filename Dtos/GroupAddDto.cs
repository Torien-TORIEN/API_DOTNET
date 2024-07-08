using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class GroupAddDto
    {
        public string Name { get; set; } = string.Empty;
        public int? CreatorId { get; set; }
        public int[] MembersIds { get; set; }
    }
}