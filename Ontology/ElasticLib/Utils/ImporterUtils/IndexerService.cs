using ElasticLib.Providers;
using Nest;

namespace ElasticLib.Utils.ImporterUtils
{
    public class IndexService
    {
        public IResponse CreateIndex(string indexName)
        {
            return ElasticClientProvider.GetClient().Indices.Create(indexName);
        }
    }
}