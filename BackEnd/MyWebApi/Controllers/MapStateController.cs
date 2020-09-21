using System;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.Models;
using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib;
using ElasticLib.QueryModel;
using MyWebApi.Utils;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapStateController : ControllerBase
    {

        private HashSet<string> map;
        private IElasticService elasticService;
        public MapStateController(IElasticService elasticService, HashSet<string> map)
        {
            this.elasticService = elasticService;
            this.map = map;
        }

        [AnyUser]
        [HttpPost]
        [Route("addNode")]
        public ActionResult<List<Edge>> AddNode([FromBody] string idNode)
        {
            //TODO -> refactor
            var edges = new List<Edge>();
            foreach(var node in map){
                var sq = new EdgeSearchQuery() {SourceAccount = idNode , DestinationAccount = node};
                edges.AddRange(elasticService.Search<Edge>(sq));
                sq.SourceAccount = node;
                sq.DestinationAccount = idNode;
                edges.AddRange(elasticService.Search<Edge>(sq));
            }
            map.Add(idNode);
            return Ok(edges);
        }

        [AnyUser]
        [HttpPost]
        [Route("deleteNode")]
        public ActionResult DeleteNode([FromBody] string idNode)
        {
            map.Remove(idNode);
            return Ok();
        }
    }
}
