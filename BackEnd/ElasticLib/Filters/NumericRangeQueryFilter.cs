using System.Linq;
using Nest;

namespace ElasticLib.Filters
{
    public class NumericRangeQueryFilter : QueryFilter
    {
        public long Min { get; set; }
        public long Max { get; set; }

        public override BoolQuery Activate(BoolQuery query)
        {
            query.Must = query.Must.Append(new NumericRangeQuery()
            {
                Field = FieldName,
                GreaterThanOrEqualTo = Min,
                LessThanOrEqualTo = Max
            });
            return query;
        }
    }
}