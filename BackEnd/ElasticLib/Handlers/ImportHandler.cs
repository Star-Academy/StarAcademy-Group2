using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Utils.ExtractorUtils;
using ElasticLib.Utils.ImporterUtils;
using ElasticLib.Utils.ValidatorUtils;

namespace ElasticLib.Handlers
{
    public class ImportHandler
    {
        private Dictionary<string, string> indexesMap;

        public ImportHandler()
        {
            indexesMap = new Dictionary<string, string>();
        }

        public void Import<T>(ISource source) where T: class
        {
            var documents = source.ExtractDocuments<T>();
            var response = new BulkService<T>().SendBulk(documents, GetIndexName<T>());
            response.Validate();
        }

        private string GetIndexName<T>()
        {
            if (!indexesMap.TryGetValue(nameof(T), out var indexName))
            {
                indexName = $"{nameof(T).ToLower()}-db";
                
                CreateIndex(nameof(T), indexName);
            }

            return indexName;
        }

        private void CreateIndex(string typeName, string indexName)
        {
            var response = new IndexService().CreateIndex(indexName);
            response.Validate();
            indexesMap.Add(typeName, indexName);
        }
    }
}