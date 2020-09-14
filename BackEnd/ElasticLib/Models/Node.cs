using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ElasticLib.Models
{
    public class Node
    {
        [JsonPropertyName("accountId")]
        public string AccountId { get; set; }
        [JsonPropertyName("ownerName")]
        public string OwnerName { get; set; }
        [JsonPropertyName("ownerFamilyName")]
        public string OwnerFamilyName { get; set; }
        [JsonPropertyName("branchName")]
        public string BranchName { get; set; }
        [JsonPropertyName("ownerId")]
        public string OwnerId { get; set; }
        [JsonPropertyName("branchAddress")]
        public string BranchAddress { get; set; }
        [JsonPropertyName("branchTelephone")]
        public string BranchTelephone { get; set; }
        [JsonPropertyName("accountType")]
        public string AccountType { get; set; }
        [JsonPropertyName("sheba")]
        public string Sheba { get; set; }
        [JsonPropertyName("cardId")]
        public string CardId { get; set; }
    }
}