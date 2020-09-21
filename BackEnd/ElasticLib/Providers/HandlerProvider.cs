using ElasticLib.Handlers;

namespace ElasticLib.Providers
{
    public class HandlerProvider
    {
        public ImportHandler ImportHandler { get; }
        public SearchHandler SearchHandler { get; }
        public AutoCompleteHandler AutoCompleteHandler { get; }
        public DeleteHandler DeleteHandler { get; }

        public HandlerProvider()
        {
            ImportHandler = new ImportHandler();
            SearchHandler = new SearchHandler();
            AutoCompleteHandler = new AutoCompleteHandler();
            DeleteHandler = new DeleteHandler();
        }
    }
}
