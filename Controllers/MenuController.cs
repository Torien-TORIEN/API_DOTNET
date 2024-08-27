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

namespace api.Controllers
{
    [Route("api/menus")]
    [ApiController]
    public class MenuEndpointsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;//Mapper Dto et Model

        public MenuEndpointsController(ApplicationDBContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            var menus = _context.Menus.ToList();
            var response = _mapper.Map<List<MenuResponseDto>>(menus);
            return Ok(response);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById([FromRoute] int id)
        {
            var menu = _context.Menus.Find(id);

            if (menu == null)
            {
                return NotFound();
            }
            var response = _mapper.Map<MenuResponseDto>(menu);
            return Ok(response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update([FromRoute] int id, [FromBody] MenuAddDto menuAddDto)
        {
            var existingMenu = _context.Menus.Find(id);

            if (existingMenu == null)
            {
                return NotFound();
            }

            existingMenu.label = menuAddDto.Label;
            existingMenu.path = menuAddDto.Path;
            existingMenu.isReadOnly = menuAddDto.IsReadOnly;

            _context.Menus.Update(existingMenu);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("add")]
        [Authorize]
        public IActionResult Add([FromBody] MenuAddDto newMenuDto)
        {
             var newMenu = new Menu
            {
                label = newMenuDto.Label,
                path = newMenuDto.Path,
                isReadOnly = newMenuDto.IsReadOnly
            };
            _context.Menus.Add(newMenu);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = newMenu.Id }, newMenu);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteById([FromRoute] int id)
        {
            var menu = _context.Menus.Find(id);
            if (menu == null)
            {
                return NotFound();
            }

            _context.Menus.Remove(menu);
            _context.SaveChanges();
            return NoContent();
        }
    }
}