using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.QueryModel;
using ElasticLib.Abstraction;
using ElasticLib.Models;
using System;
using System.Collections.Generic;
using System.Linq;

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
        
        /*
         *  testing ---------------------------------
         */
        
        // [HttpPost]
        // [Route("searchEdge")]
        // public ActionResult<IEnumerable<Edge>> EdgeSearch()
        // {
        //     try
        //     {
        //         var result = elasticService.Search<Edge>(new EdgeSearchQuery()
        //         {
        //             SourceAccount = "6039548046",
        //             DestinationAccount = "5718373092"
        //             // AmountCeiling = "200000000",
        //             // AmountFloor = "1",
        //             // DateFloor = "1399/04/22 00:00:00",
        //             // DateCeiling = "1399/04/27 00:00:00"
        //         });
        //         return Ok(result);
        //     }
        //     //TODO
        //     //dummy code
        //     catch (Exception e)
        //     {
        //         return BadRequest(e.Message);
        //     }
        // }
        
        /*
         *  end of testinggggg ----------------------
         */

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
    }
}