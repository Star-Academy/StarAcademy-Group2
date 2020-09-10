namespace ElasticLib.Utils.NamingUtils
{
    public static class NameExtractorService
    {
        public static string ExtractName<T>()
        {
            return $"{typeof(T).Name.ToLower()}-db";
        }
    }
}