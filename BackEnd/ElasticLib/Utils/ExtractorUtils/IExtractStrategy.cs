using System.Collections.Generic;

namespace ElasticLib.Utils.ExtractorUtils
{
    public interface IExtractStrategy
    {
        IEnumerable<T> Extract<T>(string content);
    }
}