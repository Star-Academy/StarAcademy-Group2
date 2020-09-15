using System;

namespace GraphLogicLib.Models
{
    public class SimpleEdge
    {
        public string SourceAccount{get; set;}
        public string DestinationAccount{get; set;}
        public long Flow {get; set;}
        public long Capacity {get; set;}
        public long RemainingCapacity => Capacity - Flow;
    }
}