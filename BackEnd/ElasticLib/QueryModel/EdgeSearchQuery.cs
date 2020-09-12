using System;
using System.Text.Json.Serialization;
using ElasticLib.Abstraction;
using ElasticLib.Utils.FilterUtils;
using ServiceStack;

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
        public string Date {
            get
            {
                if (!DateCeiling.IsNullOrEmpty() & !DateFloor.IsNullOrEmpty())
                {
                    return $"{DateFloor},{DateCeiling}";
                }

                return null;
            }
        }
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

        public void SetFiltersFrom(ExpandQuery expandQuery)
        {
            //TO CHECK
            AmountCeiling = expandQuery.AmountCeiling;
            AmountFloor = expandQuery.AmountFloor;
            DateFloor = expandQuery.DateFloor;
            DateCeiling = expandQuery.DateCeiling;
            TransactionId = expandQuery.TransactionId;
            Type = expandQuery.Type;
        }
    }
}