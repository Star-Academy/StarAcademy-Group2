using System.Linq;
using Nest;

namespace ElasticLib.Filters
{
    public class MatchQueryFilter : QueryFilter
    {
        public string Value { get; set; }
        public override BoolQuery Activate(BoolQuery query)
        {
            query.Must = query.Must.Append(new MatchQuery()
            {
                Field = FieldName,
                Query = Value
            });
            return query;
        }
    }
}