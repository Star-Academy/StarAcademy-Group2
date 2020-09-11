using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MyWebApi.Models
{
    public class Node
    {
        [JsonPropertyName("AccountID")]
        public string AccountId { get; set; }
        [JsonPropertyName("OwnerName")]
        public string OwnerName;
        [JsonPropertyName("OwnerFamilyName")]
        public string OwnerFamilyName;
        [JsonPropertyName("BranchName")]
        public string BranchName;
        [JsonPropertyName("OwnerID")]
        public string OwnerId;
        [JsonPropertyName("BranchAdress")]
        public string BranchAddress;
        [JsonPropertyName("BranchTelephone")]
        public string BranchTelephone;
        [JsonPropertyName("AccountType")]
        public string AccountType;
        [JsonPropertyName("Sheba")]
        public string Sheba;
        [JsonPropertyName("CardID")]
        public string CardId;
    }
}