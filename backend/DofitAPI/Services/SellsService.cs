using DofitAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace DofitAPI.Services
{
    public class SellsService
    {
        private readonly IMongoCollection<Sell> _sellsCollection;

        public SellsService(IOptions<DofitDatabaseSettings> DofitDatabaseSettings)
        {
            var mongoClient = new MongoClient(DofitDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(DofitDatabaseSettings.Value.DatabaseName);

            _sellsCollection = mongoDatabase.GetCollection<Sell>(DofitDatabaseSettings.Value.SellsCollectionName);
        }

        public async Task<List<Sell>> GetAsync() =>
            await _sellsCollection.Find(_ => true).ToListAsync();

        public async Task<Sell?> GetAsync(string id) =>
            await _sellsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Sell newSell) =>
            await _sellsCollection.InsertOneAsync(newSell);

        public async Task UpdateAsync(string id, Sell updatedSell) =>
            await _sellsCollection.ReplaceOneAsync(x => x.Id == id, updatedSell);

        public async Task RemoveAsync(string id) =>
            await _sellsCollection.DeleteOneAsync(x => x.Id == id);
    }
}
