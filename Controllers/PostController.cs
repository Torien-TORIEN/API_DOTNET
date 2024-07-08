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
    [Route("api/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        
        public PostController(ApplicationDBContext context)
        {
            _context=context;
        }

        [HttpGet]
        public IActionResult GetAll(){
            var users = _context.Posts
            .Include(p => p.owner)
            .ToList();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id){
            var post = _context.Posts
                               .Include(p => p.owner) // Inclure les données de l'utilisateur propriétaire
                               .FirstOrDefault(p => p.Id == id);

            if(post==null){
                return NotFound();
            }
            return Ok(post);
            
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] PostUpdateDto updatePostDto)
        {
            var existingPost = _context.Posts.Find(id);

            if (existingPost == null)
            {
                return NotFound();
            }

            existingPost.comment = updatePostDto.Comment;
            existingPost.image = updatePostDto.Image;

            _context.Posts.Update(existingPost);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("add")]
        public IActionResult Add([FromBody] PostAddDto newPostDto)
        {
            var newPost = new Post
            {
                comment = newPostDto.Comment,
                image =newPostDto.Image,
                userId = newPostDto.UserId,
                likes = 0,
                dislikes=0,
                createdAt = DateTime.Now,// Set sendAt to current time
                owner=null
            };

            _context.Posts.Add(newPost);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = newPost.Id }, newPost);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            _context.SaveChanges();

            //[SignalR]
            // Envoie le nouveau message à tous les clients via SignalR
            var hubContext = HttpContext.RequestServices.GetService<IHubContext<PostHub>>();
            hubContext.Clients.All.SendAsync("receivedPost", "Admin", $"Delete a post {id}");

            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetMessagesFromUserById([FromRoute] int userId)
        {
            var posts = _context.Posts
                                    .Where(m => m.userId == userId)
                                    .Include(m => m.owner)
                                    .ToList();
            return Ok(posts);
        }

         // Méthode pour liker un post
        [HttpPost("{id}/like")]
        public IActionResult Like([FromRoute] int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
            {
                return NotFound();
            }

            post.likes += 1;
            _context.Posts.Update(post);
            _context.SaveChanges();

            // Envoie le nouveau message à tous les clients via SignalR
            var hubContext = HttpContext.RequestServices.GetService<IHubContext<PostHub>>();
            hubContext.Clients.All.SendAsync("receivedPost", "Admin", $"Like a post {id}");

            return Ok(post);
        }

        // Méthode pour disliker un post
        [HttpPost("{id}/dislike")]
        public IActionResult Dislike([FromRoute] int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
            {
                return NotFound();
            }

            post.dislikes += 1;
            _context.Posts.Update(post);
            _context.SaveChanges();

             //[SignalR]
            // Envoie le nouveau message à tous les clients via SignalR
            var hubContext = HttpContext.RequestServices.GetService<IHubContext<PostHub>>();
            hubContext.Clients.All.SendAsync("receivedPost", "Admin", $"Dislike a post {id}");

            return Ok(post);
        }
    
    }
}