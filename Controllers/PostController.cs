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
            var users = _context.Posts.ToList();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id){
            var user = _context.Posts.Find(id);

            if(user==null){
                return NotFound();
            }
            return Ok(user);
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
            existingPost.likes = updatePostDto.Likes;

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
                likes = newPostDto.Likes,
                userId = newPostDto.UserId,
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
    }
}