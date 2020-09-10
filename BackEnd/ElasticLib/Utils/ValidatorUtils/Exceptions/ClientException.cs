using System;

namespace ElasticLib.Utils.ValidatorUtils.Exceptions
{
    [Serializable]
    public class ClientException : Exception
    {
        public ClientException()
        {
        }

        public ClientException(string message) : base(message)
        {
        }
        
        //TODO is exceptions complete?
    }
}