using System;
using ElasticLib.Abstraction;
using Microsoft.AspNetCore.Mvc;
using MyWebApi.Models;
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
        public IActionResult Import([FromBody] string url)
        {
            try
            {
                elasticService.ImportDocument<Node>(CsvToJson.Convert(new LocalSourceReader().Read(url)));
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}