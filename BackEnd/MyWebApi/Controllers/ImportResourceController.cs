using System;
using ElasticLib.Abstraction;
using Microsoft.AspNetCore.Mvc;
using ElasticLib.Models;
using SourceReaderLib;
using SourceReaderLib.SourceReader;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImportResourceController : ControllerBase
    {
        private IElasticService elasticService;
        private ISourceReader localSourceReader;

        public ImportResourceController(IElasticService elasticService, ISourceReader localSourceReader)
        {
            this.elasticService = elasticService;
            this.localSourceReader = localSourceReader;
        }

        [HttpPost]
        [Route("importAccounts")]
        public IActionResult ImportAccounts([FromBody] string url)
        {
            try
            {
                elasticService.ImportDocument<Node>(CsvToJson.Convert(localSourceReader.Read(url)));
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("importTransactions")]
        public IActionResult ImportTransactions([FromBody] string url)
        {
            try
            {
                elasticService.ImportDocument<Edge>(CsvToJson.Convert(localSourceReader.Read(url)));
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e.Message);
            }
        }

    }
}