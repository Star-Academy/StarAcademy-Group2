using System.Collections.Generic;
using ElasticLib.Utils.FilterUtils;

namespace ElasticLib.Abstraction
{
    public interface IElasticService
    {
        void ImportDocument<T>(string source) where T : class;
        IEnumerable<T> Search<T>(IFilterable filterable) where T : class;
        IEnumerable<string> AutoComplete();
    }
}