using System;

namespace GraphLogicLib.Models
{
    public class SimpleNode
    {
        public string Account {get; set;}
        public int DestinationDistance {get; set;} = int.MaxValue;
        public int SourceDistance {get; set;}
    }
}