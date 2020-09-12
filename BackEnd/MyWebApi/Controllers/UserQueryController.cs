using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.QueryModel;
using ElasticLib.Abstraction;
using MyWebApi.Models;
using System;
using System.Collections.Generic;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserQueryController : ControllerBase
    {
        private IElasticService elasticService;

        public UserQueryController(IElasticService elasticService)
        {
            this.elasticService = elasticService;
        }

        [HttpPost]
        [Route("searchNode")]
        public ActionResult<IEnumerable<Node>> NodeSearch([FromBody] string json)
        {
            var nodeSearchQuery = JsonSerializer.Deserialize<NodeSearchQuery>(json);
            try
            {
                var result = elasticService.Search<Node>(nodeSearchQuery);
                return Ok(result);
            }
            //TODO
            //dummy code
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("expand")]
        public ActionResult<List<Tuple<HashSet<Node>, HashSet<Edge>>>> Expand([FromBody] string json)
        {
            var expandQuery = JsonSerializer.Deserialize<ExpandQuery>(json);
            var output = new List<Tuple<HashSet<Node>, HashSet<Edge>>>();

            foreach (var acc in expandQuery.Accounts)
            {
                var nodes = new HashSet<Node>();
                var edges = new HashSet<Edge>();
                var incomingEdgeSearchQuery = new EdgeSearchQuery()
                {
                    DestinationAccount = acc
                };
                var outcomingEdgeSearchQuery = new EdgeSearchQuery()
                {
                    SourceAccount = acc
                };
                incomingEdgeSearchQuery.SetFiltersFrom(expandQuery);
                outcomingEdgeSearchQuery.SetFiltersFrom(expandQuery);
                foreach (var edge in elasticService.Search<Edge>(incomingEdgeSearchQuery))
                {
                    var ns = new NodeSearchQuery()
                    {
                        AccountId = edge.SourceAccount
                    };
                    nodes.UnionWith(elasticService.Search<Node>(ns));
                    edges.Add(edge);
                }
                foreach (var edge in elasticService.Search<Edge>(outcomingEdgeSearchQuery))
                {
                    var ns = new NodeSearchQuery()
                    {
                        AccountId = edge.DestinationAccount
                    };
                    nodes.UnionWith(elasticService.Search<Node>(ns));
                    edges.Add(edge);
                }
                output.Add(new Tuple<HashSet<Node>, HashSet<Edge>>(nodes, edges));
            }
            return output;
        }
    }
}