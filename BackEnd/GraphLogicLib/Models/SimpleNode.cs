using System;
using System.Collections.Generic;

namespace GraphLogicLib.Models
{
    public class SimpleNode
    {
        public string Account {get; set;}
        public HashSet<SimpleEdge> Edges {get; set;}

        public override bool Equals(object obj)
        {
            return obj is SimpleNode node &&
                   Account == node.Account;
        }

        public override int GetHashCode()
        {
            int hashCode = -2010329767;
            hashCode = hashCode * -1521134295 + EqualityComparer<string>.Default.GetHashCode(Account);
            return hashCode;
        }
    }
}