using System;
using Nest;

namespace ElasticLib.Providers
{
    public static class ElasticClientProvider
    {
        private const string ElasticHost = "http://localhost:9200";
        private static IElasticClient client = GenerateClient();

        private static IElasticClient GenerateClient()
        {
            var setting = new ConnectionSettings(new Uri(ElasticHost));
            //TODO --> remove this for final product :)
            setting.EnableDebugMode();
            return new ElasticClient(setting);
        }
        
        public static IElasticClient GetClient()
        {
            return client;
        }
    }
}