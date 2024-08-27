using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty; // The actual refresh token value
        public DateTime ExpirationDate { get; set; } // When the token expires
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow; // When the token was issued
        public string IpAddress { get; set; } = string.Empty; // Optionally store IP address for security
        public bool IsRevoked { get; set; } = false; // To mark if the token has been revoked
        public DateTime? RevokedDate { get; set; } // When the token was revoked

        public int UserId { get; set; } // Foreign key to the User
        public User User { get; set; } // Navigation property to the User
    }
}