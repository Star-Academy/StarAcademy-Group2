using System;

namespace ElasticLib.Utils.ValidatorUtils.Exceptions
{
    [Serializable]
    public class IndexNotFoundException : Exception
    {
        public IndexNotFoundException()
        {
        }

        public IndexNotFoundException(string message) : base(message)
        {
        }
        
    }
}