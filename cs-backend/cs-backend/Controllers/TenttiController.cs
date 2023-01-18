﻿using System;
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
    public class TenttiController : ControllerBase
    {
        private readonly TenttiDBContext _context;

        public TenttiController(TenttiDBContext context)
        {
            _context = context;
        }

        // GET: api/Tentti
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tentti>>> Gettentti()
        {
            return await _context.tentti.ToListAsync();
        }

        // GET: api/Tentti/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tentti>> GetTentti(int id)
        {
            var tentti = await _context.tentti.FindAsync(id);

            if (tentti == null)
            {
                return NotFound();
            }

            return tentti;
        }

        // PUT: api/Tentti/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTentti(int id, Tentti tentti)
        {
            if (id != tentti.id)
            {
                return BadRequest();
            }

            _context.Entry(tentti).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TenttiExists(id))
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

        // POST: api/Tentti
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Tentti>> PostTentti(Tentti tentti)
        {
            _context.tentti.Add(tentti);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTentti", new { id = tentti.id }, tentti);
        }

        // DELETE: api/Tentti/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTentti(int id)
        {
            var tentti = await _context.tentti.FindAsync(id);
            if (tentti == null)
            {
                return NotFound();
            }

            _context.tentti.Remove(tentti);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TenttiExists(int id)
        {
            return _context.tentti.Any(e => e.id == id);
        }
    }
}
