using System.Text.Json.Serialization;

namespace MyWebApi.Models
{
    public class Edge
    {
        [JsonPropertyName("SourceAcount")]
        public string SourceAccount { get; set; }
        [JsonPropertyName("DestiantionAccount")]
        public string DestiantionAccount { get; set; }
        [JsonPropertyName("Amount")]
        public long Amount { get; set; }
        [JsonPropertyName("Date")]
        public string Date { get; set; }
        [JsonPropertyName("TransactionID")]
        public string TransactionId { get; set; }
        [JsonPropertyName("Type")]
        public string Type { get; set; }
    }
}