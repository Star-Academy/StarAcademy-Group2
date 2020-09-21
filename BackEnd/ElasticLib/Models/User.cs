using System.Text.Json.Serialization;
using ElasticLib.Abstraction;
using ElasticLib.Utils.FilterUtils;
using Nest;

namespace ElasticLib.Models
{
    public enum UserType
    {
        Simple,
        Admin
    }

    public class User : IFilterable
    {
        [MatchFilter]
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; } //TODO hash
        [JsonPropertyName("type")]
        public UserType Type { get; set; }
    }
}