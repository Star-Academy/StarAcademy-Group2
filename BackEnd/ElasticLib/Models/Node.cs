using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ElasticLib.Models
{
    public class Node
    {
        [JsonPropertyName("AccountId")]
        public string AccountId { get; set; }
        [JsonPropertyName("OwnerName")]
        public string OwnerName { get; set; }
        [JsonPropertyName("OwnerFamilyName")]
        public string OwnerFamilyName { get; set; }
        [JsonPropertyName("BranchName")]
        public string BranchName { get; set; }
        [JsonPropertyName("OwnerId")]
        public string OwnerId { get; set; }
        [JsonPropertyName("BranchAddress")]
        public string BranchAddress { get; set; }
        [JsonPropertyName("BranchTelephone")]
        public string BranchTelephone { get; set; }
        [JsonPropertyName("AccountType")]
        public string AccountType { get; set; }
        [JsonPropertyName("Sheba")]
        public string Sheba { get; set; }
        [JsonPropertyName("CardId")]
        public string CardId { get; set; }
    }
}