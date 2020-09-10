using Nest;

namespace ElasticLib.Filters
{
    public abstract class QueryFilter
    {
        public string FieldName { get; set; }

        public abstract BoolQuery Activate(BoolQuery query);
    }
}