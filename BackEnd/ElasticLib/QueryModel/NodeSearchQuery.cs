using System.Text.Json.Serialization;
using ElasticLib.Abstraction;
using ElasticLib.Utils.FilterUtils;

namespace ElasticLib.QueryModel
{
    public class NodeQuerySearch : IFilterable
    {
        [JsonPropertyName("ownerName")]
        [MatchFilter]
        public string OwnerName {get; set;}
        [JsonPropertyName("OwnerFamilyName")]
        [MatchFilter]
        public string OwnerFamilyName {get; set;}
        [JsonPropertyName("branchName")]
        [MatchFilter]
        public string BranchName {get; set;}
        [JsonPropertyName("ownerId")]
        [MatchFilter]
        public long OwnerId {get; set;}
        [JsonPropertyName("branchAddress")]
        [MatchFilter]
        public string BranchAddress {get; set;}
        [JsonPropertyName("branchTelephone")]
        [MatchFilter]
        public string BranchTelephone {get; set;}
        [JsonPropertyName("accountType")]
        [MatchFilter]
        public string AccountType {get; set;}
        [JsonPropertyName("sheba")]
        [MatchFilter]
        public string Sheba {get; set;}
        [JsonPropertyName("cardId")]
        [MatchFilter]
        public long CardId {get; set;}
        [MatchFilter]
        [JsonPropertyName("accountId")]
        public long AccountId {get; set;}
    }
}