using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Hubs;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public MessageController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var messages = _context.Messages.ToList();
            return Ok(messages);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var message = _context.Messages.Find(id);

            if (message == null)
            {
                return NotFound();
            }
            return Ok(message);
        }

        [HttpPut("{id}")]
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
        public IActionResult Add([FromBody] MessageAddDto newMessageDto)
        {
            var newMessage = new Message
            {
                message = newMessageDto.Message,
                fromUserId = newMessageDto.FromUserId,
                toUserId = newMessageDto.ToUserId,
                sendAt = DateTime.Now,// Set sendAt to current time
                fromUser=null,
                toUser=null
            };

            _context.Messages.Add(newMessage);
            _context.SaveChanges();

            //[SignalR]
            // Envoie le nouveau message à tous les clients via SignalR
            var hubContext = HttpContext.RequestServices.GetService<IHubContext<MessageHub>>();
            hubContext.Clients.All.SendAsync("ReceiveMessage", "Admin", $"New message: {newMessage.message}");

            return CreatedAtAction(nameof(GetById), new { id = newMessage.Id }, newMessage);
        }

        [HttpDelete("{id}")]
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
        public IActionResult GetMessagesFromUserById([FromRoute] int userId)
        {
            var messages = _context.Messages
                                    .Where(m => m.fromUserId == userId)
                                    .Include(m => m.fromUser)
                                    .Include(m => m.toUser)
                                    .ToList();
            return Ok(messages);
        }

        [HttpGet("toUser/{userId}")]
        public IActionResult GetMessagesSentToUserById([FromRoute] int userId)
        {
            var messages = _context.Messages
                                    .Where(m => m.toUserId == userId)
                                    .Include(m => m.fromUser)
                                    .Include(m => m.toUser)
                                    .ToList();
            return Ok(messages);
        }
    }
}
