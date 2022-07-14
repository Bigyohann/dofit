using MongoDB.Bson.Serialization.Attributes;

namespace DofitAPI.Models
{
    public class Sell
    {
        [BsonElement("PurchasePrice")]
        public int PurchasePrice { get; set; }

        [BsonElement("SellingPrice")]
        public int SellingPrice { get; set; }

        [BsonElement("Profit")]
        public int Profit { get; set; }

        [BsonElement("Sold")]
        public bool Sold { get; set; }

        [BsonElement("Margin")]
        public double Margin { get; set; }

        [BsonElement("Comments")]
        public string? Comments { get; set; }
    }
}
