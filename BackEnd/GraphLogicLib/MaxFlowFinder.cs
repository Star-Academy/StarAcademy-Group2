using System;
using System.Collections.Generic;
using GraphLogicLib.Models;

namespace GraphLogicLib{
    class MaxFlowFinder{
        public HashSet<SimpleNode> Graph;

        MaxFlowFinder(){
            Graph = BuildGraph();
        }
        public int Find(){
            var output = 0;
            return output;
        }
        public HashSet<SimpleNode> BuildGraph(){
            var output = new HashSet<SimpleNode>();

            return output;
        }

    }
}