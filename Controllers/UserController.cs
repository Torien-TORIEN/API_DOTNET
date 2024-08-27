using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserEndpointsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly PasswordHasher<User> _passwordHasher;

        public UserEndpointsController(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAll(int page = 1, int pageSize = 10)
        {
            var totalCount = _context.Users.Count();
            var totalPage = (int)Math.Ceiling((decimal)totalCount/pageSize);
            var users = _context.Users
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(u => u.profile)
                .ToList();
            
            var response = _mapper.Map<List<UserSimpleResponseDto>>(users);

            // Créer un objet pour renvoyer les données paginées
            var result = new
            {
                TotalCount = totalCount, // Total des utilisateurs
                Page = page,             // Page actuelle
                PageSize = pageSize,     // Taille de la page (nombre d'éléments par page)
                Users = users            // Liste des utilisateurs pour cette page
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById([FromRoute] int id)
        {
            var user = _context.Users
                .Include(u=>u.profile)
                    .ThenInclude(p=>p.Menus)
                .FirstOrDefault(u=>u.Id==id);

            if (user == null)
            {
                return NotFound();
            }
            var response = _mapper.Map<UserResponseDto>(user);
            return Ok(response);
        }
        
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update([FromRoute] int id, [FromBody] UserUpdateDto userUpdateDto)
        {
            // Rechercher l'utilisateur existant dans la base de données
            var existingUser = _context.Users.Find(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            // Mettre à jour les propriétés de l'utilisateur avec les valeurs du DTO
            existingUser.username = userUpdateDto.Username;
            existingUser.email = userUpdateDto.Email;

            // Mettre à jour le profil de l'utilisateur en fonction du profileID passé
            var profile = _context.Profiles.Find(userUpdateDto.profileID);
            if (profile == null)
            {
                return BadRequest("Profile not found");
            }
            existingUser.profile = profile;

            // Mettre à jour l'utilisateur dans le contexte de la base de données
            _context.Users.Update(existingUser);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPut("{id}/reset-password")]
        [Authorize]
        public IActionResult ResetPassword([FromRoute] int id, [FromBody] PasswordResetDto passwordResetDto)
        {
            var existingUser = _context.Users.Find(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            // Vérifier si l'ancien mot de passe correspond
            var verificationResult = _passwordHasher.VerifyHashedPassword(existingUser, existingUser.password, passwordResetDto.OldPassword);
            if (verificationResult != PasswordVerificationResult.Success)
            {
                return BadRequest("The old password is incorrect.");
            }

            // Vérifier que le nouveau mot de passe et sa confirmation correspondent
            if (passwordResetDto.NewPassword != passwordResetDto.ConfirmNewPassword)
            {
                return BadRequest("The new password and confirmation password do not match.");
            }

            // Hacher le nouveau mot de passe avant de le sauvegarder
            existingUser.password = _passwordHasher.HashPassword(existingUser, passwordResetDto.NewPassword);

            // Mettre à jour l'utilisateur dans la base de données
            _context.Users.Update(existingUser);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("add")]
        [Authorize]
        public IActionResult Add([FromBody] UserAddDto newUserDto)
        {
             var newUser = new User
            {
                username = newUserDto.Username,
                email = newUserDto.Email
            };

            // Hacher le mot de passe avant de le sauvegarder
            newUser.password = _passwordHasher.HashPassword(newUser, newUserDto.Password);

            _context.Users.Add(newUser);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, newUser);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteById([FromRoute] int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
