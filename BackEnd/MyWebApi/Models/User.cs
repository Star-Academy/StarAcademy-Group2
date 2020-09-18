using System.Text.Json.Serialization;

namespace MyWebApi.Models
{
    public class User
    {
        [JsonPropertyName("username")]
        public string Username {get; set;}
        [JsonIgnore]
        public string Password; //TODO hash 
    }
}