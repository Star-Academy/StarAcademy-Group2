using System.Collections.Generic;

namespace MyWebApi.Models
{
    public class Map
    {
        private HashSet<string> Content = new HashSet<string>();

        public void DeleteFromMap(string idNode){
            this.Content.Remove(idNode);
        }

        public void AddToMap(string idNode){
            foreach(var node in this.Content){
                
            }
            this.Content.Add(idNode);
        }
    }
}