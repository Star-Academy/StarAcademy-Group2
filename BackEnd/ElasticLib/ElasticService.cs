using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Filters;
using ElasticLib.Handlers;
using ElasticLib.Providers;
using ElasticLib.Utils.FilterUtils;

namespace ElasticLib
{
    public class ElasticService : IElasticService
    {
        private HandlerProvider handlerProvider = new HandlerProvider();

        public void ImportDocument<T>(ISource source) where T : class
        {
            handlerProvider.ImportHandler.Import<T>(source);
        }

        public IEnumerable<T> Search<T>(IFilterable filterable) where T : class
        {
            return handlerProvider.SearchHandler.Search<T>(filterable);
        }

        public IEnumerable<string> AutoComplete()
        {
            throw new System.NotImplementedException();
        }
    }
}