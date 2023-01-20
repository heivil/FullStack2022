using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cs_backend.Models;
using System.Diagnostics;

namespace cs_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KysymysController : ControllerBase
    {
        private readonly TenttiDBContext _context;

        public KysymysController(TenttiDBContext context)
        {
            _context = context;
        }

        // GET: api/Kysymys
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Kysymys>>> Getkysymys()
        {
            return await _context.kysymys.ToListAsync();
        }

        // GET: api/Kysymys/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Kysymys>>> GetKysymys(int id)
        {
            return await _context.kysymys.Where(x => x.tentti_id == id).ToListAsync();
        }

        // PUT: api/Kysymys/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKysymys(int id, Kysymys kysymys)
        {
            if (id != kysymys.id)
            {
                return BadRequest();
            }

            _context.Entry(kysymys).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KysymysExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Kysymys
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Kysymys>> PostKysymys(Kysymys kysymys)
        {
            //var temp = _context.kysymys.Where(x => x.id == kysymys.id);

            _context.kysymys.Add(kysymys);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKysymys", new { id = kysymys.id }, kysymys);
        }

        // DELETE: api/Kysymys/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKysymys(int id)
        {
            var kysymys = await _context.kysymys.FindAsync(id);
            if (kysymys == null)
            {
                return NotFound();
            }

            _context.kysymys.Remove(kysymys);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KysymysExists(int id)
        {
            return _context.kysymys.Any(e => e.id == id);
        }
    }
}
