using System.Collections.Generic;
using System.Linq;
using ElasticLib.Abstraction;
using ElasticLib.Filters;
using ElasticLib.Providers;
using ElasticLib.Utils.FilterUtils;
using ElasticLib.Utils.NamingUtils;
using ElasticLib.Utils.ValidatorUtils;
using Nest;

namespace ElasticLib.Handlers
{
    public class SearchHandler
    {
        public IEnumerable<T> Search<T>(IFilterable filterable) where T : class
        {
            var filters = filterable.GetFilters();
            var indexName = GetIndexName<T>();
            var query = GenerateQueryDescriptor(filters);
            var response = ElasticClientProvider.GetClient().Search<T>(s => s
                .Index(indexName)
                .Query(q => query));
            response.Validate();
            return GetDocuments(response);
        }


        private BoolQuery GenerateQueryDescriptor(IEnumerable<QueryFilter> filters)
        {
            var query = new BoolQuery()
            {
                Must = new List<QueryContainer>()
            };
            foreach (var filter in filters)
            {
                query = filter.Activate(query);
            }

            return query;
        }


        private string GetIndexName<T>()
        {
            return NameExtractorService.ExtractName<T>();
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