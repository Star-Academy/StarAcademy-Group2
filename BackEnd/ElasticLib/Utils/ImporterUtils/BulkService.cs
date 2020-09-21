using System.Collections.Generic;
using ElasticLib.Providers;
using Nest;

namespace ElasticLib.Utils.ImporterUtils
{
    public class BulkService<T> where T : class
    {
        public IResponse SendBulk(IEnumerable<T> documents, string indexName)
        {
            var bulk = CreateBulkDescriptor(documents, indexName);
            return ElasticClientProvider.GetClient().Bulk(bulk);
        }

        private BulkDescriptor CreateBulkDescriptor(IEnumerable<T> documents, string indexName)
        {
            var bulkDescriptor = new BulkDescriptor();
            foreach (var document in documents)
            {
                bulkDescriptor.Index<T>(d => d
                    .Index(indexName)
                    .Document(document)
                );
            }

            return bulkDescriptor;
        }
    }
}
