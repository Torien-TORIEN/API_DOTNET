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
    [Route("api/profiles")]
    [ApiController]
    public class ProfileEndpointsController: ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;//Mapper Dto et Model

        public ProfileEndpointsController(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAll()
        {
            var profiles = _context.Profiles.Include(p => p.Menus).ToList();
            var response = _mapper.Map<List<ProfileResponseDto>>(profiles);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var profile = _context.Profiles
                          .Include(p => p.Menus) // Inclure la relation avec les menus
                          .FirstOrDefault(p => p.Id == id);

            if (profile == null)
            {
                return NotFound();
            }

            var response = _mapper.Map<ProfileResponseDto>(profile);
            return Ok(response);
        }

        
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update([FromRoute] int id, [FromBody] ProfileAddDto profileAddDto)
        {
            var existingProfile = _context.Profiles.Find(id);

            if (existingProfile == null)
            {
                return NotFound();
            }

            existingProfile.label = profileAddDto.Label;

            _context.Profiles.Update(existingProfile);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPut("menus/{id}")]
        [Authorize]
        public IActionResult UpdateWithMenus([FromRoute] int id, [FromBody] ProfileUpdateDto profileUpdateDto)
        {
            Console.WriteLine("\n id : " + id);
            Console.WriteLine(" ProfileUpdateDto : " + profileUpdateDto);

            // Rechercher le profil existant par son ID
            var existingProfile = _context.Profiles.Include(p => p.Menus).FirstOrDefault(p => p.Id == id);

            if (existingProfile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            // Mettre à jour le label du profil
            existingProfile.label = profileUpdateDto.Label;

            // Supprimer les menus qui ne sont plus présents dans la nouvelle liste des IDs
            var menusToRemove = existingProfile.Menus
                .Where(m => !profileUpdateDto.MenusIds.Contains(m.Id))
                .ToList();

            foreach (var menu in menusToRemove)
            {
                existingProfile.Menus.Remove(menu);
            }

            // Récupérer les menus de la base de données dont les IDs sont dans profileUpdateDto.MenusIds
            var menuIdsToAdd = profileUpdateDto.MenusIds
                .Where(menuId => !existingProfile.Menus.Any(em => em.Id == menuId))
                .ToList();

            var newMenus = _context.Menus
                .Where(m => menuIdsToAdd.Contains(m.Id))
                .ToList();

            foreach (var menu in newMenus)
            {
                existingProfile.Menus.Add(menu);
            }

            // Sauvegarder les modifications dans la base de données
            _context.SaveChanges();

            return NoContent();
        }



        [HttpPost("add")]
        [Authorize]
        public IActionResult Add([FromBody] ProfileAddDto newProfileDto)
        {
             var newProfile = new api.Models.Profile
            {
                label = newProfileDto.Label
            };
            _context.Profiles.Add(newProfile);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = newProfile.Id }, newProfile);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteById([FromRoute] int id)
        {
            var profile = _context.Profiles.Find(id);
            if (profile == null)
            {
                return NotFound();
            }

            _context.Profiles.Remove(profile);
            _context.SaveChanges();
            return NoContent();
        }

        // Add Menu to Profile
        [HttpPost("{profileId}/menus/{menuId}")]
        [Authorize]
        public IActionResult AddMenuToProfile([FromRoute] int profileId, [FromRoute] int menuId)
        {
            var profile = _context.Profiles.Include(p => p.Menus).FirstOrDefault(p => p.Id == profileId);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            var menu = _context.Menus.Find(menuId);
            if (menu == null)
            {
                return NotFound(new { message = "Menu not found" });
            }

            profile.Menus.Add(menu);
            _context.SaveChanges();

            return NoContent();
        }

        // Add Menus list to Profile
        [HttpPost("{profileId}/menus")]
        [Authorize]
        public IActionResult AddMenusToProfile([FromRoute] int profileId, [FromBody] List<int> menuIds)
        {
            var profile = _context.Profiles.Include(p => p.Menus).FirstOrDefault(p => p.Id == profileId);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            var menus = _context.Menus.Where(m => menuIds.Contains(m.Id)).ToList();
            if (!menus.Any())
            {
                return NotFound(new { message = "Menus not found" });
            }

            foreach (var menu in menus)
            {
                if (!profile.Menus.Contains(menu))
                {
                    profile.Menus.Add(menu);
                }
            }

            _context.SaveChanges();

            return NoContent();
        }

        // Delete Menu from Profile
        [HttpDelete("{profileId}/menus/{menuId}")]
        [Authorize]
        public IActionResult RemoveMenuFromProfile([FromRoute] int profileId, [FromRoute] int menuId)
        {
            var profile = _context.Profiles.Include(p => p.Menus).FirstOrDefault(p => p.Id == profileId);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            var menu = profile.Menus.FirstOrDefault(m => m.Id == menuId);
            if (menu == null)
            {
                return NotFound(new { message = "Menu not found in profile" });
            }

            profile.Menus.Remove(menu);
            _context.SaveChanges();

            return NoContent();
        }
    }
}