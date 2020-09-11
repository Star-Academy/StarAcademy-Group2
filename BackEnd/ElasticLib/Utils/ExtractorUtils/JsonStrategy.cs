using System.Collections.Generic;
using System.Text.Json;

namespace ElasticLib.Utils.ExtractorUtils
{
    public class JsonStrategy: IExtractStrategy
    {
        public IEnumerable<T> Extract<T>(string content)
        {
            return JsonSerializer.Deserialize<List<T>>(content);
        }
    }
}