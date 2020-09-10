using System;

namespace ElasticLib.Utils.ValidatorUtils.Exceptions
{
    [Serializable]
    public class ServerException : Exception
    {
        public ServerException()
        {
        }

        public ServerException(string message) : base(message)
        {
        }
        
        //TODO is exceptions complete?
    }
}