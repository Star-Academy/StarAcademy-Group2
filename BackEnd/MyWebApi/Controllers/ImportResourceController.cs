using ElasticLib.Abstraction;
using Microsoft.AspNetCore.Mvc;
using SourceReaderLib;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImportResourceController : ControllerBase
    {
        private IElasticService elasticService;

        public ImportResourceController(IElasticService elasticService)
        {
            this.elasticService = elasticService;
        }

        [HttpPost]
        [Route("import")]
        public ActionResult<string> Import([FromBody] string url)
        {
            return Ok(elasticService.ImportDocument<Node>(10));
        }
    }
}