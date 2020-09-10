using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Enums;

namespace ElasticLib.Utils.ExtractorUtils
{
    public static class ExtractorService
    {
        private static Dictionary<SourceType, IExtractStrategy> strategies;

        static ExtractorService()
        {
            strategies = new Dictionary<SourceType, IExtractStrategy>
            {
                {SourceType.Csv, new CsvStrategy()},
                {SourceType.Csv, new JsonStrategy()}
            };
        }

        public static IEnumerable<T> ExtractDocuments<T>(this ISource source)
        {
            return strategies.TryGetValue(source.Type, out var strategy)
                ? strategy.Extract<T>(source.Content)
                : new List<T>();
        }
    }
}