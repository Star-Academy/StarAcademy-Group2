using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.QueryModel;
using ElasticLib.Abstraction;
using MyWebApi.Models;
using ElasticLib.Utils.ValidatorUtils.Exceptions;
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
            //TODO
            var nodeQuerySearch = JsonSerializer.Deserialize<NodeQuerySearch>(json);
            try
            {
                var result = elasticService.Search<Node>(nodeQuerySearch);
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

                // foreach(var edge in elasticService.Search<Edge>(incomingEdgeSearchQuery)){
                //     var ns = new NodeSearchQuery(){
                //         SourceAccount = edge.DestiantionAccount
                //     };
                //     nodes.Add(elasticService.Search<Node>());
                //     edges.Add();
                // }
                // foreach(var edge in elasticService.Search<Edge>(outcomingEdgeSearchQuery)){
                //     nodes.Add();
                //     edges.Add();
                // }


                output.Add(new Tuple<HashSet<Node>, HashSet<Edge>>(nodes, edges));
            }
            
            return output;
        }
    }
}