using System;

namespace GraphLogicLib.Models
{
    public class SimpleEdge
    {
        public SimpleNode src{get; set;}
        public SimpleNode dst{get; set;}
        public int Flow {get; set;}
        public int Capacity {get; set;}
        public int RemainingCapacity => Capacity - Flow;
    }
}