using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string username { get; set; } = String.Empty;
        public string  email { get; set; }= String.Empty; 
        public string  password { get; set; }= String.Empty;
        
        public int? profileId { get; set; }//Navigation
        public Profile? profile { get; set;}

        // Ajouter cette ligne pour la relation one-to-many avec RefreshTokens
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}