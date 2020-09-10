using ElasticLib.Utils.ValidatorUtils.Exceptions;
using Nest;

namespace ElasticLib.Utils.ValidatorUtils
{
    public static class ValidateService
    {
        public static void Validate(this IResponse response)
        {
            if (response.IsValid & response.ApiCall.Success)
            {
                return;
            }

            if (response.ServerError != null)
            {
                throw new ServerException(response.ServerError.ToString());
            }

            if (response.ApiCall.OriginalException != null)
            {
                throw new ClientException(response.ApiCall.OriginalException.Message);
            }
        }
    }
}