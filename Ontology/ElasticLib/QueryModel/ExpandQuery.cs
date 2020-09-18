using System.Collections.Generic;
using System.Text.Json.Serialization;
using ElasticLib.Abstraction;
using ElasticLib.Utils.FilterUtils;
using ServiceStack;

namespace ElasticLib.QueryModel
{
    public class ExpandQuery : IFilterable
    {
        //all accounts that the edge needs to be envolved with as either destination or source:
        [JsonPropertyName("accounts")]
        [MatchFilter]
        public List<string> Accounts {get; set;}
        [JsonIgnore]
        [NumericRangeFilter]
        public string Amount {
            get
            {
                if (!AmountCeiling.IsNullOrEmpty() && !AmountFloor.IsNullOrEmpty())
                {
                    return $"{AmountFloor},{AmountCeiling}";
                }

                return null;
            }
        }
        [JsonPropertyName("amountCeiling")]
        public string AmountCeiling {get; set;}
        [JsonPropertyName("amountFloor")]
        public string AmountFloor {get; set;}
        [JsonIgnore]
        [DateRangeFilter]
        public string Date => $"{DateFloor},{DateCeiling}";
        //YYYY-MM-dd[T]hh:mm:ss
        //2030-01-01T00:00:00
        [JsonPropertyName("dateFloor")]
        public string DateFloor {get; set;}
        [JsonPropertyName("dateCeiling")]
        public string DateCeiling {get; set;}
        [JsonPropertyName("transactionId")]
        [MatchFilter]
        public string TransactionId {get; set;}
        [MatchFilter]
        [JsonPropertyName("type")]
        public string Type {get; set;}
    }
}
