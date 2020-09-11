using System.Collections.Generic;
using ServiceStack;

namespace ElasticLib.Utils.ExtractorUtils
{
    public class CsvStrategy: IExtractStrategy
    {
        public IEnumerable<T> Extract<T>(string content)
        {
            return content.FromCsv<List<T>>();
        }
    }
}