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
            var nodeQuerySearch = JsonSerializer.Deserialize<NodeQuerySearch>(json);
            
            //dummy code:

            //return elastic.nodesearch(nodeQuerySearch); 
            return null;
        }

        [HttpPost]
        [Route("searchEdge")]
        public ActionResult<string> EdgeSearch([FromBody] string json)
        {
            //TODO
            var edgeSearchQuery = JsonSerializer.Deserialize<EdgeSearchQuery>(json);
            
            //dummy code:

            //return elastic.nodesearch(edgeSearchQuery); 
            return null;
        }
    }
}