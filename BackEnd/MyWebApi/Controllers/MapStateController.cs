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

        private List<HashSet<string>> map = new List<HashSet<string>>();
        private IElasticService elasticService;
        private int activeIndex;
        public MapStateController(IElasticService elasticService)
        {
            this.elasticService = elasticService;
        }

        [AnyUser]
        [HttpPost]
        [Route("addNode")]
        public ActionResult<List<Edge>> AddNode([FromBody] string idNode)
        {
            //TODO -> refactor
            var edges = new List<Edge>();
            foreach(var node in map[activeIndex]){
                var sq = new EdgeSearchQuery() {SourceAccount = idNode , DestinationAccount = node};
                edges.AddRange(elasticService.Search<Edge>(sq));
                sq.SourceAccount = node;
                sq.DestinationAccount = idNode;
                edges.AddRange(elasticService.Search<Edge>(sq));
            }
            map[activeIndex].Add(idNode);
            return Ok(edges);
        }

        [AnyUser]
        [HttpPost]
        [Route("deleteNode")]
        public ActionResult DeleteNode([FromBody] string idNode)
        {
            map[activeIndex].Remove(idNode);
            return Ok();
        }

        [HttpPost]
        [Route("clearMap")]
        public ActionResult ClearMap()
        {
            map[activeIndex].Clear();
            return Ok();
        }

        [HttpPost]
        [Route("import")]
        public ActionResult Import([FromBody] HashSet<string> idNodes)
        {
            foreach(var idNode in idNodes){
                map[activeIndex].Add(idNode);
            }
            return Ok();
        }

        [HttpPost]
        [Route("createMap")]
        public ActionResult CreateMap()
        {
            map.Add(new HashSet<string>());
            return Ok();
        }

        [HttpPost]
        [Route("deleteMap")]
        public ActionResult DeleteMap([FromBody] int index) //after this tell me what index is active
        {
            map.RemoveAt(index);
            return Ok();
        }

        [HttpPost]
        [Route("switchMap")]
        public ActionResult SwitchMap([FromBody] int index)
        {
            this.activeIndex = index;
            return Ok();
        }
    }
}
