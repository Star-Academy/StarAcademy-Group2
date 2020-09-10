using System.Text.Json.Serialization;

namespace ElasticLib.QueryModel
{
    public class EdgeSearchQuery
    {
        //all accounts that the edge needs to be envolved with as either destination or source:
        [JsonPropertyName("accounts")]
        public string[] Accounts {get; set;}
        [JsonPropertyName("amountCeiling")]
        public long AmountCeiling {get; set;}
        [JsonPropertyName("amountFloor")]
        public long AmountFloor {get; set;}
/*
attention


we should handle date data type later


attention
*/
        [JsonPropertyName("dateFloor")]
        public string DateFloor {get; set;}
        [JsonPropertyName("dateCeiling")]
        public string DateCeiling {get; set;}
        [JsonPropertyName("transactionId")]
        public long TransactionId {get; set;}
        [JsonPropertyName("type")]
        public string Type {get; set;}
    }
}