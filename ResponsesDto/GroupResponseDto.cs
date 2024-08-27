using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class GroupResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public int? CreatorId { get; set; }
        public UserSimpleResponseDto? Creator { get; set; }

        // Many-to-Many relationship
        public ICollection<UserSimpleResponseDto> Members { get; set; } = new List<UserSimpleResponseDto>();
    }
}