using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.QueryModel;
using ElasticLib.Abstraction;
using ElasticLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib;

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
        public ActionResult<IEnumerable<Node>> NodeSearch([FromBody] NodeSearchQuery nodeSearchQuery)
        {
            try
            {
                var result = elasticService.Search<Node>(nodeSearchQuery);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("expand")]
        public ActionResult<List<Tuple<HashSet<Node>, HashSet<Edge>>>> Expand([FromBody] ExpandQuery expandQuery)
        {
            var output = new List<Tuple<HashSet<Node>, HashSet<Edge>>>();
            var nodes = new HashSet<Node>();
            var edges = new HashSet<Edge>();
            var accs = String.Join(' ',expandQuery.Accounts);
            var incomingEdgeSearchQuery = new EdgeSearchQuery()
            {
                DestinationAccount = accs
            };
            var outcomingEdgeSearchQuery = new EdgeSearchQuery()
            {
                SourceAccount = accs
            };
            incomingEdgeSearchQuery.SetFiltersFrom(expandQuery);
            outcomingEdgeSearchQuery.SetFiltersFrom(expandQuery);
            var nodesId = new HashSet<string>();
            foreach (var edge in elasticService.Search<Edge>(incomingEdgeSearchQuery))
            {
                nodesId.Add(edge.SourceAccount);
                edges.Add(edge);
            }
            foreach (var edge in elasticService.Search<Edge>(outcomingEdgeSearchQuery))
            {
                nodesId.Add(edge.DestinationAccount);
                edges.Add(edge);
            }
            nodes.UnionWith(elasticService
                .Search<Node>(
                    new NodeSearchQuery()
                    {
                        AccountId = String.Join(' ', nodesId)
                    }
                )
            );
            output.Add(new Tuple<HashSet<Node>, HashSet<Edge>>(nodes, edges));
            return output;
        }

        [HttpPost]
        [Route("flow")]
        public ActionResult<long> Flow([FromBody] Tuple<string,string> sourceAndDestinationId)
        {
            var maxFlowFinder = new MaxFlowFinder(sourceAndDestinationId.Item1, sourceAndDestinationId.Item2);
            maxFlowFinder.InitGraph();
            return maxFlowFinder.Find();
        }

        [HttpGet]
        [Route("FindAllPath")]
        public IActionResult FindAllPath(string sourceId, string destinationId, int maxLength=5)
        {
            try
            {
                var nb = new NetworkBuilder(sourceId, destinationId, maxLength, false);
                nb.Build();
                return Ok(new Tuple<HashSet<Node>, HashSet<Edge>>(nb.Nodes, nb.Edges));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e.Message);
            }
        }
    }
}