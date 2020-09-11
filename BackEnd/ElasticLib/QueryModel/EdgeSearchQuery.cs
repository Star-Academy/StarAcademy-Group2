using System.Text.Json.Serialization;
using ElasticLib.Abstraction;
using ElasticLib.Utils.FilterUtils;

namespace ElasticLib.QueryModel
{
    public class EdgeSearchQuery : IFilterable
    {
        //all accounts that the edge needs to be envolved with as either destination or source:
        [JsonPropertyName("sourceAccount")]
        [MatchFilter]
        public string SourceAccount {get; set;}
        [JsonPropertyName("destinationAccount")]
        [MatchFilter]
        public string DestinationAccount { get; set; }
    }
}