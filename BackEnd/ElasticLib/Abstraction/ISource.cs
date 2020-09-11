using ElasticLib.Enums;

namespace ElasticLib.Abstraction
{
    public interface ISource
    {
        string Content { get; set; }
        SourceType Type { get; set; }
    }
}