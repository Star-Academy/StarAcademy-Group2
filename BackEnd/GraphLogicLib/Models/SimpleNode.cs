using System;
using System.Collections.Generic;

namespace GraphLogicLib.Models
{
    public class SimpleNode
    {
        public string Account {get; set;}
        public int DestinationDistance {get; set;} = int.MaxValue;
        public int SourceDistance {get; set;}
        public HashSet<SimpleEdge> edges {get; set;}
    }
}