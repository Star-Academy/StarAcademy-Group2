using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using MyWebApi.Models;
using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib;
using ElasticLib.QueryModel;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapStateController : ControllerBase
    {
        
        private HashSet<string> map = new HashSet<string>();
        private IElasticService elasticService;
        public MapStateController(IElasticService elasticService)
        {
            this.elasticService = elasticService;
        }

        [HttpPost]
        [Route("addNode")]
        public ActionResult<List<Edge>> AddNode([FromBody] string idNode)
        { 
            var edges = new List<Edge>();
            foreach(var node in map){
                var sq = new EdgeSearchQuery() {SourceAccount = idNode , DestinationAccount = node};
                edges.AddRange(elasticService.Search<Edge>(sq));
            }
            map.Add(idNode);
            return Ok(edges);
        }

        [HttpPost]
        [Route("deleteNode")]
        public ActionResult DeleteNode([FromBody] string idNode)
        {
            map.Remove(idNode);
            return Ok();
        }
    }
}