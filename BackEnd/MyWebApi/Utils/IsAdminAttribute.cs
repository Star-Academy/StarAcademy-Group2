using ElasticLib.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyWebApi.Models;
using System;

namespace MyWebApi.Utils
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class IsAdminAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = (User)context.HttpContext.Items["User"];

            if (user == null)
            {
                context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            }
            else if(user.Type.Equals(UserType.Admin))
            {
                context.Result = new JsonResult(new { message = "true" }) { StatusCode = StatusCodes.Status200OK };
            }
            else{
                context.Result = new JsonResult(new { message = "false" }) { StatusCode = StatusCodes.Status400BadRequest };
            }
        }
    }
}