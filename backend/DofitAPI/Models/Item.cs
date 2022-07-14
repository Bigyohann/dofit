using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DofitAPI.Models
{
    public class Item
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("ItemName")]
        public string ItemName { get; set; } = null!;

        [BsonElement("Level")]
        public int Level { get; set; }

        [BsonElement("Category")]
        public string Category { get; set; } = null!;

        [BsonElement("Profession")]
        public string Profession { get; set; } = null!;

        [BsonElement("Sells")]
        public Sell[]? Sells { get; set; }
    }
}
