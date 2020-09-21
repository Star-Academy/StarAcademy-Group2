using ElasticLib.Abstraction;
using ElasticLib.Models;
using ElasticLib.Utils.ValidatorUtils.Exceptions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MyWebApi.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using WebApi.Utils;

namespace MyWebApi.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        User GetByUsername(string username);
    }

    public class UserService : IUserService
    {
        private User primaryAdmin = new User { Username = "admin", Password = "admin", Type = UserType.Admin };

        private readonly AppSettings _appSettings;
        private IElasticService elasticService;

        public UserService(IOptions<AppSettings> appSettings, IElasticService elastic)
        {
            _appSettings = appSettings.Value;
            elasticService = elastic;
        }

        ///<summery>
        /// returns null if user not found
        ///</summery>
        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            User user = null;
            try
            {
                var result = elasticService.Search<User>(new User { Username = model.Username });
                if(result.Any())
                    user = result.ElementAt(0);
                else
                    return null;
            }
            catch (IndexNotFoundException e)
            {
                elasticService.ImportDocument<User>(JsonSerializer.Serialize(new List<User> { primaryAdmin }));
                if(!primaryAdmin.Username.Equals(model.Username) || !primaryAdmin.Password.Equals(model.Password))
                    return null;
            }

            if (user == null || !user.Password.Equals(model.Password)) return null;

            // authentication successful so generate jwt token
            var token = generateJwtToken(user);

            return new AuthenticateResponse(user, token);
        }

        public User GetByUsername(string username)
        {
            return elasticService.Search<User>(new User{Username = username}).ElementAt(0);
        }

        private string generateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("username", user.Username) }),
                // token is valid for 3 days
                Expires = DateTime.UtcNow.AddDays(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}