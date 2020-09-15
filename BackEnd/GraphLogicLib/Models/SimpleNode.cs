using System;
using System.Collections.Generic;

namespace GraphLogicLib.Models
{
    public class SimpleNode
    {
        public string Account {get; set;}
        public HashSet<SimpleEdge> Edges {get; set;}
    }
}