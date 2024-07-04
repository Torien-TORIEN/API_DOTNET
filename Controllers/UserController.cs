using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public UserController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] loginDto loginUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.username == loginUser.Username && u.password == loginUser.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(user);
        }
        
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] UserAddDto userAppdateDto)
        {
            var existingUser = _context.Users.Find(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.username = userAppdateDto.Username;
            existingUser.email = userAppdateDto.Email;
            existingUser.password = userAppdateDto.Password;

            _context.Users.Update(existingUser);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("add")]
        public IActionResult Add([FromBody] UserAddDto newUserDto)
        {
             var newUser = new User
            {
                username = newUserDto.Username,
                email = newUserDto.Email,
                password = newUserDto.Password,
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, newUser);
        }

        [HttpDelete("{id}")]
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
