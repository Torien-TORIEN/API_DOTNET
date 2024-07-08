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
    [Route("api/groups")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public GroupController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var groups = _context.Groups
                .Include(g => g.Members) // Inclure les utilisateurs associés
                .ToList();
            return Ok(groups);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var group = _context.Groups
                .Include(g => g.Members) // Inclure les utilisateurs associés
                .FirstOrDefault(g => g.Id == id);

            if (group == null)
            {
                return NotFound();
            }

            return Ok(group);
        }

        // Récupérer tous les groupes auxquels un utilisateur appartient
        [HttpGet("user/{userId}/groups")]
        public IActionResult GetGroupsByUser(int userId)
        {
            var user = _context.Users
                .Include(u => u.Groups) // Inclure les groupes associés
                .FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            var groups = user.Groups;
            return Ok(groups);
        }

        // Récupérer tous les utilisateurs d'un groupe
        [HttpGet("{groupId}/users")]
        public IActionResult GetUsersByGroup(int groupId)
        {
            var group = _context.Groups
                .Include(g => g.Members) // Inclure les utilisateurs associés
                .FirstOrDefault(g => g.Id == groupId);

            if (group == null)
            {
                return NotFound();
            }

            var users = group.Members;
            return Ok(users);
        }


        [HttpPost("add")]
        public IActionResult Create([FromBody] GroupAddDto newGroupDto)
        {
            if (newGroupDto == null)
            {
                return BadRequest();
            }

            var users = _context.Users
                                .Where(u => newGroupDto.MembersIds.Contains(u.Id))
                                .ToList();

            var newGroup = new Group
            {
                name = newGroupDto.Name,
                Members = users
            };

            _context.Groups.Add(newGroup);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = newGroup.Id }, newGroup);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] GroupUpdateDto updatedGroupDto)
        {
            if (updatedGroupDto == null)
            {
                return BadRequest();
            }

            var group = _context.Groups.Find(id);
            if (group == null)
            {
                return NotFound();
            }

            group.name = updatedGroupDto.Name;

            _context.Groups.Update(group);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var group = _context.Groups.Find(id);
            if (group == null)
            {
                return NotFound();
            }

            _context.Groups.Remove(group);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPost("{groupId}/users/{userId}")]
        public IActionResult AddUserToGroup(int groupId, int userId)
        {
            var group = _context.Groups.Include(g => g.Members).FirstOrDefault(g => g.Id == groupId);
            var user = _context.Users.Find(userId);

            if (group == null || user == null)
            {
                return NotFound();
            }

            group.Members.Add(user);
            _context.SaveChanges();

            return Ok(group);
        }

        [HttpDelete("{groupId}/users/{userId}")]
        public IActionResult RemoveUserFromGroup(int groupId, int userId)
        {
            var group = _context.Groups.Include(g => g.Members).FirstOrDefault(g => g.Id == groupId);
            var user = _context.Users.Find(userId);

            if (group == null || user == null)
            {
                return NotFound();
            }

            group.Members.Remove(user);
            _context.SaveChanges();

            return Ok(group);
        }
    }
}
