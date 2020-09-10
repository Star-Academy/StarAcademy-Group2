using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Filters;
using ElasticLib.Handlers;
using ElasticLib.Providers;

namespace ElasticLib
{
    public class ElasticService : IElasticService
    {
        private HandlerProvider handlerProvider = new HandlerProvider();

        public void ImportDocument<T>(ISource source) where T : class
        {
            handlerProvider.ImportHandler.Import<T>(source);
        }

        public IEnumerable<T> Search<T>(IEnumerable<QueryFilter> filters) where T : class
        {
            return handlerProvider.SearchHandler.Search<T>(filters);
        }

        public IEnumerable<string> AutoComplete()
        {
            throw new System.NotImplementedException();
        }
    }
}