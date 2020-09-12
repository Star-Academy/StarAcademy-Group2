using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using ElasticLib;
using ElasticLib.Abstraction;
using ElasticLib.Enums;
using ElasticLib.Filters;
using ElasticLib.Handlers;
using ElasticLib.Utils.FilterUtils;
using Nest;
using SourceReaderLib;

namespace Driver
{
    class Program
    {
        static void Main(string[] args)
        {
            // var content = File.ReadAllLines(@"../../../../../Assets/TestAccounts.csv");
            // var content = File.ReadAllLines(@"../../../TestDB.csv");
            // var s = CsvToJson.Convert(content);
            //
            // var documents = JsonSerializer.Deserialize<List<Node>>(s);
            //
            // Console.WriteLine("hello");

            // var service = new ElasticService();
            // service.ImportDocument<Node>(s);

            // var filter = new MatchQueryFilter()
            // {
            //     FieldName = "name",
            //     Value = "AmirMahdi"
            // };

            // var filter = new NumericRangeQueryFilter()
            // {
            //     FieldName = "age",
            //     Min = 19,
            //     Max = 25
            // };

            // var results = service.Search<Account>(new List<QueryFilter>{filter});
            // foreach (var account in results)
            // {
            //     Console.WriteLine(account);
            // }
            //2030-01-01T00:00:00
            var filter = new FilterModel()
            {
                FullName = "hello",
                Date = "2015-02-06T00:15:16,2030-05-10T02:02:02",
                Money = "16.45,1645",
                NullValue = null
            };
            
            var filters = filter.GetFilters();
            
            Console.WriteLine("hello");
        }
    }

    public class Node
    {
        public string OwnerName { get; set; }
        public string OwnerFamilyName { get; set; }
        public string BranchName { get; set; }
        [JsonPropertyName("OwnerID")]
        public string OwnerId { get; set; }
        [JsonPropertyName("BranchAdress")]
        public string BranchAddress { get; set; }
        public string BranchTelephone { get; set; }
        public string AccountType { get; set; }
        public string Sheba { get; set; }
        [JsonPropertyName("CardID")]
        public string CardId { get; set; }
        [JsonPropertyName("AccountID")]
        public string AccountId { get; set; }
    }
    
    class FilterModel : IFilterable
    {
        [MatchFilter]
        public string FullName { get; set; }
        
        [DateRangeFilter]
        public string Date { get; set; }
        
        [NumericRangeFilter]
        public string Money { get; set;
        }
        
        [MatchFilter]
        public string NullValue { get; set; }
        
        public double MoenyFirst { get; set; }
    }
    
    class Account
    {
        public string AccountId { get; set; }
        public string Name { get; set; }
        public string Family { get; set; }
        public string Age { get; set; }

        public override string ToString()
        {
            return $"{nameof(AccountId)}: {AccountId}, {nameof(Name)}: {Name}, {nameof(Family)}: {Family}, {nameof(Age)} : {Age}";
        }
    }

    class Source : ISource
    {
        public string Content { get; set; }
        public SourceType Type { get; set; }
    }
}