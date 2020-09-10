using System.Collections.Generic;

namespace ElasticLib.Abstraction
{
    public interface IElasticService
    {
        void ImportDocument<T>(ISource source) where T : class;
        IEnumerable<T> Search<T>();
        IEnumerable<string> AutoComplete();
    }
}