using System;
using System.Collections.Generic;

namespace GraphLogicLib.Models
{
    public class SimpleEdge
    {
        public string SourceAccount{get; set;}
        public string DestinationAccount{get; set;}
        public long Flow {get; set;}
        public long Capacity {get; set;}
        public long RemainingCapacity => Capacity - Flow;

        /*
            we assume there is no parallel(multiple) edge in the graph
        */
        public override bool Equals(object obj)
        {
            return obj is SimpleEdge edge &&
                   SourceAccount == edge.SourceAccount &&
                   DestinationAccount == edge.DestinationAccount;
        }

        public override int GetHashCode()
        {
            int hashCode = -312881618;
            hashCode = hashCode * -1521134295 + EqualityComparer<string>.Default.GetHashCode(SourceAccount);
            hashCode = hashCode * -1521134295 + EqualityComparer<string>.Default.GetHashCode(DestinationAccount);
            return hashCode;
        }
    }
}