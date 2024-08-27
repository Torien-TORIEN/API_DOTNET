using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class GroupSimpleResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? CreatorId { get; set; }
        public string CreatorUserName { get; set; } = string.Empty;
    }
}