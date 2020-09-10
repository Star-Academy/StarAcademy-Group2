using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using MyWebApi.Models.QueryModel;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        [HttpPost]
        [Route("searchNode")]
        public ActionResult<string> NodeSearch([FromBody] string json)
        {
            //TODO
            var nodeSearchQuery = JsonSerializer.Deserialize<NodeQuerySearch>(json);
            
            //dummy code:

            //return elastic.nodesearch(nodeSearchQuery); 
            return null;
        }
    }
}