namespace DofitAPI.Models
{
    public class DofitDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string ItemsCollectionName { get; set; } = null!;
    }
}
