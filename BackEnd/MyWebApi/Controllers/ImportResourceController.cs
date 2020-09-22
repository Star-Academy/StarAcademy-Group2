using System;
using ElasticLib.Abstraction;
using Microsoft.AspNetCore.Mvc;
using ElasticLib.Models;
using SourceReaderLib;
using SourceReaderLib.SourceReader;
using MyWebApi.Utils;

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

        [AnyUser]
        [HttpPost]
        [Route("importAccounts")]
        public IActionResult ImportAccounts([FromBody] string csv)
        {
            try
            {
                elasticService.ImportDocument<Node>(CsvToJson.Convert(csv));
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e.Message);
            }
        }

        [AnyUser]
        [HttpPost]
        [Route("importTransactions")]
        public IActionResult ImportTransactions([FromBody] string csv)
        {
            try
            {
                elasticService.ImportDocument<Edge>(CsvToJson.Convert(csv));
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