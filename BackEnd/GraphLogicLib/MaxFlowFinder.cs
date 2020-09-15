using System;
using System.Collections.Generic;
using System.Linq;
using ElasticLib.Models;
using GraphLogicLib.Models;

namespace GraphLogicLib
{
    class MaxFlowFinder
    {
        public Dictionary<string, HashSet<SimpleEdge>> Graph; // <accountId, edges>
        public Dictionary<string, int> Levels {get; set;} // <id, lvl>
        private string sourceId;
        private string destinationId;
        private const int DefaultMaxLength = 5;

        public MaxFlowFinder(string sourceId, string destId)
        {
            destinationId = destId;
            this.sourceId = sourceId;

            var networkBuilder = new NetworkBuilder(this.sourceId, destinationId, DefaultMaxLength, true);
            networkBuilder.Build();
            Graph = networkBuilder.SimpleGraph;

        }

        public int Find()
        {



            var output = 0;

            while (bfs())
            {

            }

            return output;
        }

        private bool bfs()
        {
            Levels = new Dictionary<string, int>();
            var queue = new Queue<string>();
            HashSet<SimpleEdge> neighbourEdges;

            if (Graph.TryGetValue(sourceId, out neighbourEdges))

                foreach (var node in
                    neighbourEdges.Where(edge => edge.SourceAccount.Equals(sourceId))
                        .Select(edge => edge.DestinationAccount))
                {
                    queue.Enqueue(node);
                    Levels[node] = 1;
                }

            while (queue.Any())
            {
                var node = queue.Dequeue();
                int currnetLevel = Levels[node] + 1;

                foreach (var neighbour in
                    neighbourEdges.Where(edge => edge.SourceAccount.Equals(node))
                        .Select(edge => edge.DestinationAccount))
                {
                    queue.Enqueue(neighbour);
                    Levels[neighbour] = currnetLevel;
                }
            }

            return Levels.ContainsKey(destinationId);
        }

        // public HashSet<SimpleNode> BuildGraph(){
        //     var output = new HashSet<SimpleNode>();

        //     return output;
        // }

    }
}