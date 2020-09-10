using System.Linq;
using Nest;

namespace ElasticLib.Filters
{
    public class DateRangeQueryFilter : QueryFilter
    {
        public DateMath Min { get; set; }
        public DateMath Max { get; set; }

        public override BoolQuery Activate(BoolQuery query)
        {
            query.Must = query.Must.Append(new DateRangeQuery()
            {
                Field = FieldName,
                GreaterThanOrEqualTo = Min,
                LessThanOrEqualTo = Max
            });
            return query;
        }
    }
}