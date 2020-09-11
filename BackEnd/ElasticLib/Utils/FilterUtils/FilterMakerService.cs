using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using ElasticLib.Abstraction;
using ElasticLib.Filters;
using ServiceStack;

namespace ElasticLib.Utils.FilterUtils
{
    public static class FilterMakerService
    {
        public static IEnumerable<QueryFilter> GetFilters(this IFilterable filterable)
        {
            var typeInfo = filterable.GetType();
            var matchProperties = typeInfo.GetProperties(new MatchFilterAttribute());
            var dateProperties = typeInfo.GetProperties(new DateRangeFilterAttribute());
            var numericProperties = typeInfo.GetProperties(new NumericRangeFilterAttribute());
            return MakeFilterFromProperties(filterable, matchProperties, dateProperties, numericProperties);
        }

        private static IEnumerable<PropertyInfo> GetProperties(this Type type, Attribute wantedAttribute)
        {
            return type
                .GetProperties().Where(p => p.GetCustomAttributes()
                    .Any(a => a.Equals(wantedAttribute))
                );
        }

        private static IEnumerable<QueryFilter> MakeFilterFromProperties(IFilterable obj,
            IEnumerable<PropertyInfo> matchProperties,
            IEnumerable<PropertyInfo> dateProperties,
            IEnumerable<PropertyInfo> numericProperties)
        {
            var result = new List<QueryFilter>();
            result = result.Union(matchProperties.Select(p => MakeMatchFilter(obj, p))).ToList();
            result = result.Union(dateProperties.Select(p => MakeDateFilter(obj, p))).ToList();
            result = result.Union(numericProperties.Select(p => MakeNumericFilter(obj, p))).ToList();
            return result;
        }

        private static QueryFilter MakeMatchFilter(IFilterable filterable, PropertyInfo property)
        {
            return new MatchQueryFilter()
            {
                FieldName = property.Name.ToCamelCase(),
                Value = property.GetValue(filterable).ToString()
            };
        }

        private static QueryFilter MakeDateFilter(IFilterable filterable, PropertyInfo propertyInfo)
        {
            return new DateRangeQueryFilter()
            {
                FieldName = propertyInfo.Name.ToCamelCase(),
                //TODO
                Min = new DateTime(1970, 2, 1),
                Max = new DateTime(2030, 1, 1)
            };
        }

        private static QueryFilter MakeNumericFilter(IFilterable filterable, PropertyInfo propertyInfo)
        {
            return new NumericRangeQueryFilter()
            {
                FieldName = propertyInfo.Name.ToCamelCase(),
                //TODO
                Min = float.MinValue,
                Max = float.MaxValue
            };
        }
    }
}