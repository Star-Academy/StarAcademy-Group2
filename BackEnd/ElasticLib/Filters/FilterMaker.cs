using System.Collections.Generic;
using ElasticLib.QueryModel;
using ServiceStack;

namespace ElasticLib.Filters
{
    public static class FilterMaker
    {
        public static IEnumerable<QueryFilter> MakeFilterFromNodeSearchQuery(NodeQuerySearch query)
        {
            if (query != null)
            {
                var queryFilters = new List<QueryFilter>();
                queryFilters
                    .StringPropertyMatchFilter(nameof(NodeQuerySearch.AccountType).ToCamelCase(), query.AccountType)
                    .StringPropertyMatchFilter(nameof(NodeQuerySearch.BranchAddress).ToCamelCase(), query.BranchAddress)
                    .StringPropertyMatchFilter(nameof(NodeQuerySearch.BranchName).ToCamelCase(), query.BranchName)
                    .StringPropertyMatchFilter(nameof(NodeQuerySearch.BranchTelephone).ToCamelCase(),
                        query.BranchTelephone);
            }

            return new List<QueryFilter>();
        }

        public static List<QueryFilter> StringPropertyMatchFilter(this List<QueryFilter> queryFilters, string fieldName,
            string value)
        {
            if (!string.IsNullOrEmpty(value) && !string.IsNullOrEmpty(fieldName))
            {
                var filter = new MatchQueryFilter()
                {
                    FieldName = fieldName,
                    Value = value
                };
                queryFilters.Add(filter);
            }

            return queryFilters;
        }
    }
}