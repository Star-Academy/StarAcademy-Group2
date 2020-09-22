using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

using ElasticLib.Abstraction;
using ElasticLib.Models;

using Microsoft.AspNetCore.Mvc;

using MyWebApi.Utils;

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

		[AnyUser]
		[HttpPost]
		[Route("importAccounts")]
		public async Task<IActionResult> ImportAccounts()
		{
			using(StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
			{
				try
				{
					string csv = await reader.ReadToEndAsync();
					Console.WriteLine(csv);
					elasticService.ImportDocument<Node>(CsvToJson.Convert(csv));
					return Ok();
				}
				catch (Exception e)
				{
					Console.WriteLine(e);
					return BadRequest(e.Message);
				}
			}

		}

		[AnyUser]
		[HttpPost]
		[Route("importTransactions")]
		public async Task<IActionResult> ImportTransactions()
		{
			using(StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
			{
				try
				{
					string csv = await reader.ReadToEndAsync();
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
}
