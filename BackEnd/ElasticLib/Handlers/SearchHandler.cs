using System.Collections.Generic;
using System.Linq;
using ElasticLib.Providers;
using ElasticLib.Utils.NamingUtils;
using ElasticLib.Utils.ValidatorUtils;
using Nest;

namespace ElasticLib.Handlers
{
    public class SearchHandler
    {
        public IEnumerable<T> Search<T>(QueryObject queryObject) where T : class
        {
            var indexName = GetIndexName<T>();
            var query = GenerateQueryDescriptor(queryObject.Field, queryObject.Value);
            var response = ElasticClientProvider.GetClient().Search<T>(s => s
                .Index(indexName)
                .Query(q => query)
            );
            response.Validate();
            return GetDocuments(response);
        }

        private string GetIndexName<T>()
        {
            return NameExtractorService.ExtractName<T>();
        }

        private QueryContainer GenerateQueryDescriptor(string field, string value)
        {
            var query = new MatchQuery()
            {
                Field = field,
                Query = value
            };
            return query;
        }

        private IEnumerable<T> GetDocuments<T>(ISearchResponse<T> response) where T : class
        {
            if (response.Documents != null && response.Documents.Any())
            {
                return response.Documents.ToList();
            }

            return new List<T>();
        }
    }
}