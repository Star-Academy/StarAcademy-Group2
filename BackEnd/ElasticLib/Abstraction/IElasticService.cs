using System.Collections.Generic;
using ElasticLib.Filters;
using ElasticLib.Handlers;

namespace ElasticLib.Abstraction
{
    public interface IElasticService
    {
        void ImportDocument<T>(ISource source) where T : class;
        IEnumerable<T> Search<T>(IEnumerable<QueryFilter> filters) where T : class;
        IEnumerable<string> AutoComplete();
    }
}