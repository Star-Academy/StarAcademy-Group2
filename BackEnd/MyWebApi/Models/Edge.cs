using System;
using System.Text.Json.Serialization;
using Nest;

namespace MyWebApi.Models
{
    public class Edge
    {
        [JsonPropertyName("SourceAccount")]
        public string SourceAccount { get; set; }
        [JsonPropertyName("DestinationAccount")]
        public string DestinationAccount { get; set; }

        [Ignore]
        [JsonPropertyName("Amount")]
        public string StringAmount { get; set; }
        [JsonIgnore]
        public long Amount => long.Parse(StringAmount.Replace(",", ""));

        [JsonPropertyName("Date")]
        public string Date { get; set; }
        [JsonPropertyName("TransactionID")]
        public string TransactionId { get; set; }
        [JsonPropertyName("Type")]
        public string Type { get; set; }
    }
}