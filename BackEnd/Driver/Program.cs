using System;
using System.IO;
using ElasticLib;
using ElasticLib.Abstraction;
using ElasticLib.Enums;
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

            QueryObject queryObject = new QueryObject()
            {
                Field = "name",
                Value = "Star"
            };

            var results = service.Search<Account>(queryObject);
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

        public override string ToString()
        {
            return $"{nameof(AccountId)}: {AccountId}, {nameof(Name)}: {Name}, {nameof(Family)}: {Family}";
        }
    }

    class Source : ISource
    {
        public string Content { get; set; }
        public SourceType Type { get; set; }
    }
}