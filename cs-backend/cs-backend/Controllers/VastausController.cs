using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cs_backend.Models;

namespace cs_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VastausController : ControllerBase
    {
        private readonly TenttiDBContext _context;

        public VastausController(TenttiDBContext context)
        {
            _context = context;
        }

        // GET: api/Vastaus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vastaus>>> Getvastaus()
        {
            return await _context.vastaus.ToListAsync();
        }

        // GET: api/Vastaus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Vastaus>>> GetVastaus(int id)
        {
            return await _context.vastaus.Join(_context.kysymys, vast => vast.kysymys_id, kys => kys.id, (vast, kys) => new {
                id = vast.id,
                kysymys_id = vast.kysymys_id,
                vas_nimi = vast.vas_nimi,
                pisteet = vast.pisteet,
                onko_oikein = vast.onko_oikein,
                tentti = kys.tentti_id
            }).Where(x => x.tentti == id).Select(x => new Vastaus()
                {
                id = x.id,
                kysymys_id = x.id,
                vas_nimi = x.vas_nimi,
                pisteet = x.pisteet,
                onko_oikein = x.onko_oikein
            }).
            ToListAsync();
        }

        // PUT: api/Vastaus/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVastaus(int id, Vastaus vastaus)
        {
            if (id != vastaus.id)
            {
                return BadRequest();
            }

            _context.Entry(vastaus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VastausExists(id))
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

        // POST: api/Vastaus
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Vastaus>> PostVastaus(Vastaus vastaus)
        {
            _context.vastaus.Add(vastaus);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVastaus", new { id = vastaus.id }, vastaus);
        }

        // DELETE: api/Vastaus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVastaus(int id)
        {
            var vastaus = await _context.vastaus.FindAsync(id);
            if (vastaus == null)
            {
                return NotFound();
            }

            _context.vastaus.Remove(vastaus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VastausExists(int id)
        {
            return _context.vastaus.Any(e => e.id == id);
        }
    }
}
