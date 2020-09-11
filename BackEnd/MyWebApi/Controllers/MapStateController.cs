using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ElasticLib.QueryModel;
using MyWebApi.Models;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapStateController : ControllerBase
    {
        [HttpPost]
        [Route("addNode")]
        public ActionResult<Edge[]> AddNode([FromBody] string idNode)
        {
            //TODO
            
            return null;
        }

        [HttpPost]
        [Route("deleteNode")]
        public ActionResult DeleteNode([FromBody] string idNode)
        {
            //TODO
            
            return null;
        }
    }
}