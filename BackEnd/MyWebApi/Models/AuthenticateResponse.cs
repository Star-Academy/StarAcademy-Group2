using ElasticLib.Models;

namespace MyWebApi.Models
{
    public class AuthenticateResponse
    {
        public string Username { get; set; }
        public string Type {get; set;}
        public string Token { get; set; }


        public AuthenticateResponse(User user, string token)
        {
            Username = user.Username;
            Token = token;
            Type = user.Type.ToString();
        }
    }
}