using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/groups")]
    [ApiController]
    public class GroupEndpointsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;//Mapper Dto et Model

        public GroupEndpointsController(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAll()
        {
            var groups = _context.Groups
                .Include(g => g.Members) // Inclure les utilisateurs associés
                .ThenInclude(p=>p.profile)
                .ToList();
            var response = _mapper.Map<List<GroupResponseDto>>(groups);
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById(int id)
        {
            var group = _context.Groups
                .Include(g => g.Members) // Inclure les utilisateurs associés
                .ThenInclude(p=>p.profile)
                .FirstOrDefault(g => g.Id == id);

            if (group == null)
            {
                return NotFound();
            }
            var response = _mapper.Map<GroupResponseDto>(group);
            return Ok(response);
        }

        // Récupérer tous les groupes auxquels un utilisateur appartient
        [HttpGet("user/{userId}/groups")]
        [Authorize]
        public IActionResult GetGroupsByUser(int userId)
        {
            var userGroups = _context.Groups
                .FromSqlRaw("SELECT g.* FROM Groups g INNER JOIN UserGroup ug ON g.Id = ug.GroupId WHERE ug.UserId = {0}", userId)
                .Include(g => g.creator)
                .ToList();
            
            var response = _mapper.Map<List<GroupSimpleResponseDto>>(userGroups);

            return Ok(response);
        }


        // Récupérer tous les utilisateurs d'un groupe
        [HttpGet("{groupId}/users")]
        [Authorize]
        public IActionResult GetUsersByGroup(int groupId)
        {
            var group = _context.Groups
                .Include(g => g.Members) // Inclure les utilisateurs associés
                .ThenInclude(p=>p.profile)
                .FirstOrDefault(g => g.Id == groupId);

            if (group == null)
            {
                return NotFound();
            }

            var users = group.Members;
            var response = _mapper.Map<List<UserSimpleResponseDto>>(users);
            return Ok(response);
        }


        [HttpPost("add")]
        [Authorize]
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
                creatorId = newGroupDto.CreatorId,
                Members = users
            };

            _context.Groups.Add(newGroup);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = newGroup.Id }, newGroup);
        }

        [HttpPut("{id}")]
        [Authorize]
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
        [Authorize]
        public IActionResult Delete(int id)
        {
            var group = _context.Groups.Include(g => g.Members).FirstOrDefault(g => g.Id == id);
            if (group == null)
            {
                return NotFound();
            }

            // Supprimer les messages associés au groupe
            var messages = _context.Messages.Where(m => m.toGroupId == id).ToList();
            _context.Messages.RemoveRange(messages);

            // Supprimer les relations dans UserGroup
            _context.Entry(group).Collection(g => g.Members).Load();
            group.Members.Clear();
            
            _context.Groups.Remove(group);
            _context.SaveChanges();
            return NoContent();
        }


        [HttpPost("{groupId}/users/{userId}")]
        [Authorize]
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
        [Authorize]
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
