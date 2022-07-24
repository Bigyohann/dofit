using DofitAPI.Models;
using DofitAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace DofitAPI.Controllers
{
    [ApiController]
    [Route("sells")]
    public class SellsController : ControllerBase
    {
        private readonly SellsService _sellsService;

        public SellsController(SellsService sellsService) =>
            _sellsService = sellsService;

        [HttpGet]
        public async Task<List<Sell>> Get() =>
            await _sellsService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Sell>> Get(string id)
        {
            var item = await _sellsService.GetAsync(id);

            if (item is null)
            {
                return NotFound();
            }

            return item;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Sell newSell)
        {
            await _sellsService.CreateAsync(newSell);

            return CreatedAtAction(nameof(Get), new { id = newSell.Id }, newSell);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Sell updatedSell)
        {
            var item = await _sellsService.GetAsync(id);

            if (item is null)
            {
                return NotFound();
            }

            updatedSell.Id = item.Id;

            await _sellsService.UpdateAsync(id, updatedSell);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var book = await _sellsService.GetAsync(id);

            if (book is null)
            {
                return NotFound();
            }

            await _sellsService.RemoveAsync(id);

            return NoContent();
        }
    }
}
