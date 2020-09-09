using Microsoft.AspNetCore.Mvc;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImportResourceController : ControllerBase
    {
        [HttpPost]
        [Route("import")]
        public ActionResult<string> Import([FromBody] string url)
        {
            //TODO
           return null;
        }
    }
}