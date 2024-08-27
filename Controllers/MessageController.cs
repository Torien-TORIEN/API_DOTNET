using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Hubs;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageEndpointsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public MessageEndpointsController(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAll()
        {
            var messages = _context.Messages.ToList();
            var response = _mapper.Map<List<MessageResponseDto>>(messages);
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById([FromRoute] int id)
        {
            var message = _context.Messages.Find(id);

            if (message == null)
            {
                return NotFound();
            }
            var response = _mapper.Map<MessageResponseDto>(message);
            return Ok(response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update([FromRoute] int id, [FromBody] MessageAddDto updateMessageDto)
        {
            var existingMessage = _context.Messages.Find(id);

            if (existingMessage == null)
            {
                return NotFound();
            }

            existingMessage.message = updateMessageDto.Message;
            existingMessage.fromUserId = updateMessageDto.FromUserId;
            existingMessage.toUserId = updateMessageDto.ToUserId;
            existingMessage.sendAt = DateTime.Now; // Update the sendAt time

            _context.Messages.Update(existingMessage);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("add")]
        [Authorize]
        public IActionResult Add([FromBody] MessageAddDto newMessageDto)
        {
            var newMessage = new Message
            {
                message = newMessageDto.Message,
                fromUserId = newMessageDto.FromUserId,
                toUserId = newMessageDto.ToUserId,
                isForGroup = newMessageDto.IsForGroup,
                toGroupId = newMessageDto.toGroupId,
                sendAt = DateTime.Now,// Set sendAt to current time
                fromUser=null,
                toUser=null
            };

            _context.Messages.Add(newMessage);
            _context.SaveChanges();

            //[SignalR]
            // Envoie le nouveau message à tous les clients via SignalR
            /*var hubContext = HttpContext.RequestServices.GetService<IHubContext<MessageHub>>();
            hubContext.Clients.All.SendAsync("ReceiveMessage", "Admin", $"New message: {newMessage.message}");*/

            return CreatedAtAction(nameof(GetById), new { id = newMessage.Id }, newMessage);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete([FromRoute] int id)
        {
            var message = _context.Messages.Find(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("fromUser/{userId}")]
        [Authorize]
        public IActionResult GetMessagesFromUserById([FromRoute] int userId)
        {
            var messages = _context.Messages
                                    .Where(m => m.fromUserId == userId)
                                    .Include(m => m.fromUser)
                                    .Include(m => m.toUser)
                                    .ToList();
            var response = _mapper.Map<List<MessageResponseDto>>(messages);
            return Ok(response);
        }

        [HttpGet("toUser/{userId}")]
        [Authorize]
        public IActionResult GetMessagesSentToUserById([FromRoute] int userId)
        {
            var messages = _context.Messages
                                    .Where(m => m.toUserId == userId)
                                    .Include(m => m.fromUser)
                                    .Include(m => m.toUser)
                                    .ToList();
            var response = _mapper.Map<List<MessageResponseDto>>(messages);
            return Ok(response);
        }

        // Autres méthodes existantes du contrôleur
        [HttpGet("user/{userId}")]
        [Authorize]
        public IActionResult GetMessagesForUser(int userId)
        {
            // Récupérer les messages envoyés par l'utilisateur
            var sentMessages = _context.Messages
                .Where(m => m.fromUserId == userId)
                //.Include(m => m.fromUser)
                //.Include(m => m.toUser)
                .ToList();

            // Récupérer les messages destinés à l'utilisateur
            var receivedMessages = _context.Messages
                .Where(m => m.toUserId == userId)
                //.Include(m => m.fromUser)
                //.Include(m => m.toUser)
                .ToList();

            // Récupérer les messages liés aux groupes de l'utilisateur, mais pas ceux qu'il a envoyés
            var groupMessages = _context.Messages
                .FromSqlInterpolated($@"
                    SELECT m.*
                    FROM Messages m
                    INNER JOIN Groups g ON m.toGroupId = g.Id
                    INNER JOIN UserGroup ug ON g.Id = ug.GroupId
                    WHERE ug.UserId = {userId} 
                ")
                //.Include(m => m.fromUser)
                //.Include(m => m.group)
                .ToList();

            // Fusionner les listes de messages distincts
            var userMessages = sentMessages.Union(receivedMessages).Union(groupMessages).ToList();

            var response = _mapper.Map<List<MessageResponseDto>>(userMessages);

            return Ok(response);
        }
    }
}
