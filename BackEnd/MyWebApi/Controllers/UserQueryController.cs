using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.QueryModel;
using ElasticLib.Abstraction;
using ElasticLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib;
using MyWebApi.Utils;

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

        [AnyUser]
        [HttpPost]
        [Route("searchNode")]
        public ActionResult<IEnumerable<Node>> NodeSearch([FromBody] NodeSearchQuery nodeSearchQuery)
        {
            // Console.WriteLine(nodeSearchQuery);
            // var nodeSearchQuery = JsonSerializer.Deserialize<NodeSearchQuery>(json);
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

        [AnyUser]
        [HttpPost]
        [Route("expand")]
        public ActionResult<List<Tuple<HashSet<Node>, HashSet<Edge>>>> Expand([FromBody] ExpandQuery expandQuery)
        {
            // var expandQuery = JsonSerializer.Deserialize<ExpandQuery>(json);
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


        // To improve expand



        // [HttpPost]
        // [Route("testnewexpand")]
        // public ActionResult<List<Tuple<HashSet<Node>, HashSet<Edge>>>> Sth(/*[FromBody] string json*/)
        // {
        //     // var expandQuery = JsonSerializer.Deserialize<ExpandQuery>(json);
        //     var output = new List<Tuple<HashSet<Node>, HashSet<Edge>>>();
        //     var a = String.Join(' ',new List<string>(){
        //         "6039548046",
        //         "9862369812"
        //     });
        //     var outcomingEdgeSearchQuery = new EdgeSearchQuery()
        //         {
        //             SourceAccount = a
        //         };
        //     var b = elasticService.Search<Edge>(outcomingEdgeSearchQuery);
        //     var g = from p in b
        //             group p by p.SourceAccount into something
        //             select new {Source = something.Key , Edges = something.ToList() };
        //     return output;
        // }

        [AnyUser]
        [HttpPost]
        [Route("flow")]
        public ActionResult<long> Flow([FromBody] Tuple<string,string> sourceAndDestinationId)
        {
            var maxFlowFinder = new MaxFlowFinder(sourceAndDestinationId.Item1, sourceAndDestinationId.Item2);
            maxFlowFinder.InitGraph();
            return maxFlowFinder.Find();
        }

        [AnyUser]
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