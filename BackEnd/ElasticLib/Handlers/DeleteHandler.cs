using ElasticLib.Providers;
using ElasticLib.Utils.ExtractorUtils;
using ElasticLib.Utils.NamingUtils;
using ElasticLib.Utils.ValidatorUtils;
using Nest;

namespace ElasticLib.Handlers
{
    public class DeleteHandler
    {
        public void Delete<T>(string field, string value) where T : class
        {
            var response = ElasticClientProvider.GetClient().DeleteByQuery<T>(q => q
                .Index(NameExtractorService.ExtractName<T>())
                .Query(qq => qq
                    .Term($"{field}.keyword", value)
                )
            );
            response.Validate();
        }
    }
}
