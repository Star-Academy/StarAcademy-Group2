using System;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.Models;
using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib;
using ElasticLib.QueryModel;
using MyWebApi.Utils;
using MyWebApi.Services;
using System.Linq;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapStateController : ControllerBase
    {

        private IElasticService elasticService;

        private MapStateService mapState;
        public MapStateController(IElasticService elasticService, MapStateService map)
        {
            this.elasticService = elasticService;
            this.mapState = map;
        }

        // [AnyUser]
        [HttpPost]
        [Route("addNode")]
        public ActionResult<List<Edge>> AddNode([FromBody] string idNode)
        {
            //TODO -> refactor
            var edges = new List<Edge>();
            foreach (var node in mapState.map[mapState.activeIndex].ToList())
            {
                var sq = new EdgeSearchQuery() { SourceAccount = idNode, DestinationAccount = node };
                edges.AddRange(elasticService.Search<Edge>(sq));
                var sq1 = new EdgeSearchQuery() { SourceAccount = node, DestinationAccount = idNode };
                edges.AddRange(elasticService.Search<Edge>(sq1));
            }
            mapState.map[mapState.activeIndex].Add(idNode);
            return Ok(edges);
        }

        // [AnyUser]
        [HttpPost]
        [Route("deleteNode")]
        public ActionResult DeleteNode([FromBody] string idNode)
        {
            mapState.map[mapState.activeIndex].Remove(idNode);
            return Ok();
        }

        [HttpPost]
        [Route("clearMap")]
        public ActionResult ClearMap()
        {
            mapState.map[mapState.activeIndex].Clear();
            return Ok();
        }

        [HttpPost]
        [Route("import")]
        public ActionResult Import([FromBody] HashSet<string> idNodes)
        {
            foreach (var idNode in idNodes)
            {
                mapState.map[mapState.activeIndex].Add(idNode);
            }
            return Ok();
        }

        [HttpPost]
        [Route("createMap")]
        public ActionResult CreateMap()
        {
            mapState.map.Add(new HashSet<string>());
            return Ok();
        }

        [HttpPost]
        [Route("deleteMap")]
        public ActionResult DeleteMap([FromBody] int index) //after this tell me what index is active
        {
            mapState.map.RemoveAt(index);
            return Ok();
        }

        [HttpPost]
        [Route("switchMap")]
        public ActionResult SwitchMap([FromBody] int index)
        {
            mapState.activeIndex = index;
            return Ok();
        }

        [HttpPost]
        [Route("restartMap")]
        public ActionResult RestartMap()
        {
            mapState.Restart();
            return Ok();
        }
    }
}
