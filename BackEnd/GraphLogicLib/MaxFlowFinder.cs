using System;
using System.Collections.Generic;
using System.Linq;
using ElasticLib.Models;
using GraphLogicLib.Models;

namespace GraphLogicLib
{
    class MaxFlowFinder
    {

        /*
            we assume there is no parallel(multiple) edge in the graph
        */
        public Dictionary<string, HashSet<SimpleEdge>> Graph; // <accountId, edges>
        public Dictionary<string, int> Levels { get; set; } // <id, lvl>
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

        public long Find()
        {
            long result = 0;

            while (bfs())
                result += sendFlow(sourceId, new List<SimpleEdge>());
            
            return result;
        }

        private bool bfs()
        {
            Levels = new Dictionary<string, int>();
            var queue = new Queue<string>();

            queue.Enqueue(sourceId);
            Levels[sourceId] = 0;

            while (queue.Any())
            {
                var node = queue.Dequeue();
                int currnetLevel = Levels[node] + 1;
                HashSet<SimpleEdge> neighbourEdges;

                //TODO to remove
                if (!Graph.TryGetValue(node, out neighbourEdges))
                    throw new Exception("wtf ._.");

                foreach (var neighbour in
                    neighbourEdges
                        .Where(edge => edge.SourceAccount.Equals(node) && edge.RemainingCapacity > 0)
                        .Select(edge => edge.DestinationAccount))
                {
                    if (!Levels.ContainsKey(node))
                    {
                        queue.Enqueue(node);
                        Levels[node] = currnetLevel;
                    }
                }
            }

            return Levels.ContainsKey(destinationId);
        }

        private long sendFlow(string node, List<SimpleEdge> path)
        {
            if (node.Equals(destinationId))
            {
                return updateCapacity(path);
            }
            
            long result = 0;

            foreach(var edge in Graph[node])
            {
                if(edge.SourceAccount.Equals(node) && edge.RemainingCapacity > 0 
                    && Levels[edge.DestinationAccount] == Levels[node]+1)
                {
                    path.Add(edge);
                    result += sendFlow(edge.DestinationAccount, path);
                    path.Remove(edge);
                }
            }

            return result;
        }

        private long updateCapacity(List<SimpleEdge> path)
        {
            long flow = path.Min(edge => edge.RemainingCapacity);

            foreach (var edge in path)
            {
                edge.Flow += flow;

                SimpleEdge equalReversed = new SimpleEdge()
                {
                    SourceAccount = edge.DestinationAccount,
                    DestinationAccount = edge.SourceAccount
                    //equals() is only based on these 2
                };

                if (Graph[edge.DestinationAccount].TryGetValue(equalReversed, out var actualReversed))
                {
                    actualReversed.Flow -= flow;
                    // what happens to the one in "DestAcount" 's set?
                }
                else
                {
                    equalReversed.Capacity = edge.Capacity;
                    //what happens to the other fields?

                    Graph[edge.DestinationAccount].Add(equalReversed);
                    Graph[edge.SourceAccount].Add(equalReversed);
                }
            }

            return flow;
        }
    }
}