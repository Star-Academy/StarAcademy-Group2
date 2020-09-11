using System;
using System.Collections.Generic;
using System.IO;
using ElasticLib;
using ElasticLib.Abstraction;
using ElasticLib.Enums;
using ElasticLib.Filters;
using ElasticLib.Handlers;

namespace Driver
{
    class Program
    {
        static void Main(string[] args)
        {
            var content = File.ReadAllText(@"../../../TestDB.csv");
            ISource source = new Source()
            {
                Content = content,
                Type = SourceType.Csv
            };
            var service = new ElasticService();
            service.ImportDocument<Account>(source);

            // var filter = new MatchQueryFilter()
            // {
            //     FieldName = "name",
            //     Value = "AmirMahdi"
            // };

            var filter = new NumericRangeQueryFilter()
            {
                FieldName = "age",
                Min = 19,
                Max = 25
            };

            var results = service.Search<Account>(new List<QueryFilter>{filter});
            foreach (var account in results)
            {
                Console.WriteLine(account);
            }
        }
    }

    class Account
    {
        public string AccountId { get; set; }
        public string Name { get; set; }
        public string Family { get; set; }


        public int Age { get; set; }

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