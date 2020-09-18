using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using ElasticLib.Abstraction;
using ElasticLib.Filters;
using Nest;
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
            result = result.Union(ExtractFilters(matchProperties, obj, MakeMatchFilter)).ToList();
            result = result.Union(ExtractFilters(dateProperties, obj, MakeDateFilter)).ToList();
            result = result.Union(ExtractFilters(numericProperties, obj, MakeNumericFilter)).ToList();
            return result;
        }

        private static IEnumerable<QueryFilter> ExtractFilters(IEnumerable<PropertyInfo> properties, IFilterable obj,
            Func<IFilterable, PropertyInfo, QueryFilter> maker)
        {
            return properties
                .Where(p => p.HasValue(obj))
                .Select(p => maker(obj, p));
        }
        
        private static bool HasValue(this PropertyInfo property, IFilterable filterable)
        {
            return property.GetValue(filterable) != null;
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
            var borders = propertyInfo.GetValue(filterable).ToString().Split(',');
            return new DateRangeQueryFilter()
            {
                FieldName = propertyInfo.Name.ToCamelCase(),
                Min = DateMath.FromString(borders[0]),
                Max = DateMath.FromString(borders[1])
            };
        }

        private static QueryFilter MakeNumericFilter(IFilterable filterable, PropertyInfo propertyInfo)
        {
            var borders = propertyInfo.GetValue(filterable).ToString().Split(',');
            return new NumericRangeQueryFilter()
            {
                FieldName = propertyInfo.Name.ToCamelCase(),
                Min = long.Parse(borders[0]),
                Max = long.Parse(borders[1])
            };
        }
    }
}