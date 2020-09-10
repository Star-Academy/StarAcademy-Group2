using System.Collections.Generic;
using ElasticLib.Abstraction;
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

        public IEnumerable<T> Search<T>()
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<string> AutoComplete()
        {
            throw new System.NotImplementedException();
        }
    }
}