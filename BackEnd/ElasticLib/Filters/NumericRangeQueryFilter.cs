using System.Linq;
using Nest;

namespace ElasticLib.Filters
{
    public class NumericRangeQueryFilter : QueryFilter
    {
        public float Min { get; set; }
        public float Max { get; set; }

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