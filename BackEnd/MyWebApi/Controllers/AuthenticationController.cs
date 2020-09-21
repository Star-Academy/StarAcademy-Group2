using Microsoft.AspNetCore.Mvc;
using MyWebApi.Utils;
using MyWebApi.Models;
using MyWebApi.Services;
using ElasticLib.Models;
using ElasticLib.Abstraction;
using System.Linq;
using System.Text.Json;
using System.Collections.Generic;
using ElasticLib.Utils.ValidatorUtils.Exceptions;
using System;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private IUserService userService;
        private IElasticService elasticService;

        public AuthenticationController(IUserService userService, IElasticService elasticService)
        {
            this.userService = userService;
            this.elasticService = elasticService;
        }

        [HttpPost("login")]
        public IActionResult Login(AuthenticateRequest model)
        {
            var response = userService.Authenticate(model);

            if (response == null)
                return BadRequest("Username or password is incorrect");

            return Ok(response);
        }

        [IsAdmin]
        [HttpGet("isAdmin")]
        public void isAdmin()
        {
            /*intentionally blank*/
        }

        [IsSimpleUser]
        [HttpGet("isSimpleUser")]
        public void IsSimple()
        {
            /*intentionally blank*/
        }

        [JustAdmin]
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            try
            {
                if (elasticService.Search<User>(user).Any())
                    return BadRequest("username already reserved");
            }
            catch (IndexNotFoundException e)
            {
                /*intentionally blank*/
            }

            elasticService.ImportDocument<User>(JsonSerializer.Serialize(new List<User> {user}));
            return Ok();
        }

        [HttpDelete("deleteUser")]
        public IActionResult DeleteUser(string username)
        {
            try
            {
                elasticService.DeleteDocument<User>("username", username);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return (BadRequest(e.Message));
            }

            return Ok();
        }
    }
}
