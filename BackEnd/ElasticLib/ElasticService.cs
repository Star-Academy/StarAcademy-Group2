using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Providers;

namespace ElasticLib
{
    public class ElasticService : IElasticService
    {
        private HandlerProvider handlerProvider = new HandlerProvider();

        public void ImportDocument<T>(string source) where T : class
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

        public void DeleteDocument<T>(string field, string value) where T : class
        {
            handlerProvider.DeleteHandler.Delete<T>(field, value);
        }
    }
}
