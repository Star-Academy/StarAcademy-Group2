using System.Collections.Generic;

namespace MyWebApi.Services
{
    public class MapStateService
    {
        public List<HashSet<string>> map  { get; set;}= new List<HashSet<string>>();
        public int activeIndex {get; set;}




    }
}
