using System.Collections.Generic;
using System.Text.Json.Serialization;
using ElasticLib.Abstraction;
using ElasticLib.Utils.FilterUtils;
using ServiceStack;

namespace ElasticLib.QueryModel
{
    public class FindAllPathQuery
    {
        [JsonPropertyName("sourceIds")]
        public List<string> SourceIds {get; set;}
        [JsonPropertyName("destinationIds")]
        public List<string> DestinationIds {get; set;}
        [JsonPropertyName("maxLength")]
        public int MaxLength {get; set;}

    }
}