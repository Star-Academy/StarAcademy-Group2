using System.Collections.Generic;

namespace MyWebApi.Services
{
    public class MapStateService
    {
        public List<HashSet<string>> map { get; set; } = new List<HashSet<string>>() { new HashSet<string>() };
        public int activeIndex { get; set; }

        public void Restart()
        {
            map = new List<HashSet<string>>() { new HashSet<string>() };
        }

    }
}
