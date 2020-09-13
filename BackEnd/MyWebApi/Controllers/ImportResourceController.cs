using System;
using ElasticLib.Abstraction;
using Microsoft.AspNetCore.Mvc;
using ElasticLib.Models;
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
        [Route("importAccounts")]
        public IActionResult ImportAccounts([FromBody] string url)
        {
            try
            {
                elasticService.ImportDocument<Node>(CsvToJson.Convert(new LocalSourceReader().Read(url)));
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("importTransactions")]
        public IActionResult ImportTransactions([FromBody] string url)
        {
            try
            {
                elasticService.ImportDocument<Edge>(CsvToJson.Convert(new LocalSourceReader().Read(url)));
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
        }
    }
}