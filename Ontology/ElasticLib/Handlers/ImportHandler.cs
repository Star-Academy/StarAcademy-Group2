using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Providers;
using ElasticLib.Utils.ExtractorUtils;
using ElasticLib.Utils.ImporterUtils;
using ElasticLib.Utils.NamingUtils;
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

        public void Import<T>(string source) where T: class
        {
            var documents = source.ExtractDocuments<T>();
            var response = new BulkService<T>().SendBulk(documents, GetIndexName<T>());
            response.Validate();
        }

        private string GetIndexName<T>()
        {
            var typeName = typeof(T).Name.ToLower();
            if (!indexesMap.TryGetValue(typeName, out var indexName))
            {
                indexName = NameExtractorService.ExtractName<T>();
                if (!IsIndexExist(indexName))
                {
                    CreateIndex(typeName, indexName);
                }
            }

            return indexName;
        }

        private void CreateIndex(string typeName, string indexName)
        {
            var response = new IndexService().CreateIndex(indexName);
            response.Validate();
            indexesMap.Add(typeName, indexName);
        }

        private bool IsIndexExist(string indexName)
        {
            return ElasticClientProvider.GetClient().Indices.Exists(indexName).Exists;
        }
    }
}