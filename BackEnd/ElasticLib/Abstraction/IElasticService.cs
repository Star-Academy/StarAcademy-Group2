using System.Collections.Generic;
using ElasticLib.Handlers;

namespace ElasticLib.Abstraction
{
    public interface IElasticService
    {
        void ImportDocument<T>(ISource source) where T : class;
        IEnumerable<T> Search<T>(QueryObject queryObject) where T : class;
        IEnumerable<string> AutoComplete();
    }
}