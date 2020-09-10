using System.Text.Json.Serialization;

namespace ElasticLib.QueryModel
{
    public class NodeQuerySearch
    {
        [JsonPropertyName("ownerName")]
        public string OwnerName {get; set;}
        [JsonPropertyName("OwnerFamilyName")]
        public string OwnerFamilyName {get; set;}
        [JsonPropertyName("branchName")]
        public string BranchName {get; set;}
        [JsonPropertyName("ownerId")]
        public long OwnerId {get; set;}
        [JsonPropertyName("branchAddress")]
        public string BranchAddress {get; set;}
        [JsonPropertyName("branchTelephone")]
        public string BranchTelephone {get; set;}
        [JsonPropertyName("accountType")]
        public string AccountType {get; set;}
        [JsonPropertyName("sheba")]
        public string Sheba {get; set;}
        [JsonPropertyName("cardId")]
        public long CardId {get; set;}
        [JsonPropertyName("accountId")]
        public long AccountId {get; set;}
    }
}