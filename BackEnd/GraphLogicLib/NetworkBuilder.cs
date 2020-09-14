using System;
using System.Collections.Generic;
using ElasticLib.Models;
using ElasticLib.QueryModel;

namespace GraphLogicLib{
    public class NetworkBuilder{
        public void Build(int maxPathLength = 5, bool copyMaker = false){
            var nodes = new HashSet<Node>();
            var edges = new HashSet<Edge>();
            var incomingEdgeSearchQuery = new EdgeSearchQuery();
            //bfs dst
            //src dfs
            //return paths
        }
    }
}