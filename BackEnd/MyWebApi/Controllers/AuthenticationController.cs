using Microsoft.AspNetCore.Mvc;
using MyWebApi.Utils;
using MyWebApi.Models;
using MyWebApi.Services;
using ElasticLib.Models;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private IUserService _userService;

        public AuthenticationController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login(AuthenticateRequest model)
        {
            var response = _userService.Authenticate(model);

            if (response == null)
                return BadRequest("Username or password is incorrect");

            return Ok(response);
        }

        [Authorize]
        [HttpPost("simp")]
        public IActionResult Test()
        {
            return Ok(true);
        }

        // [Authorize(UserType.Admin)]
        [Authorize]
        [HttpPost("admin")]
        public IActionResult Test2()
        {
            return Ok(true);
        }

    }
}