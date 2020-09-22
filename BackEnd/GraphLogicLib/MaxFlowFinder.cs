using System;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib.Models;

namespace GraphLogicLib
{
    public class MaxFlowFinder
    {

        /*
            we assume there is no parallel(multiple) edge in the graph
        */
        public Dictionary<string, HashSet<SimpleEdge>> Graph; // <accountId, edges>
        public Dictionary<string, int> Levels { get; set; } // <id, lvl>
        
        private const string sourceNode = "s";
        private const string destinationNode= "t";
        private const int DefaultMaxLength = 8;

        /// <summary>
        /// Don't forget to call initGraph() after contructing (in the API)
        /// </summary>
        public void InitGraph(List<string> sourceList, List<string> destinationList)
        {
            var networkBuilder = new NetworkBuilder(sourceList, destinationList, DefaultMaxLength, true);
            networkBuilder.Build();
            Graph = networkBuilder.SimpleGraph;
            initSource(sourceList);
            initDestination(destinationList);
        }
        private void initSource(List<string> sourceList){
            Graph[sourceNode] = new HashSet<SimpleEdge>();
            foreach(var source in sourceList){
                var edge = new SimpleEdge(){
                    Capacity = long.MaxValue,
                    Flow = 0,
                    SourceAccount = sourceNode,
                    DestinationAccount = source
                };
                Graph[sourceNode].Add(edge);
                Graph[source].Add(edge);
            }
        }
        private void initDestination(List<string> destinationList){
            Graph[destinationNode] = new HashSet<SimpleEdge>();
            foreach(var destination in destinationList){
                var edge = new SimpleEdge(){
                    Capacity = long.MaxValue,
                    Flow = 0,
                    SourceAccount = destination,
                    DestinationAccount = destinationNode
                };
                Graph[destinationNode].Add(edge);
                Graph[destination].Add(edge);
            }
        }


        public long Find()
        {
            long result = 0;

            while (Bfs())
            {
                var reveresedEdgesToAdd = new HashSet<SimpleEdge>();
                result += SendFlow(sourceNode, new List<SimpleEdge>(), ref reveresedEdgesToAdd);
                foreach(var edge in reveresedEdgesToAdd)
                {
                    Graph[edge.DestinationAccount].Add(edge);
                    Graph[edge.SourceAccount].Add(edge);
                }
            }

            return result;
        }

        public bool Bfs()
        {
            Levels = new Dictionary<string, int>();
            var queue = new Queue<string>();

            queue.Enqueue(sourceNode);
            Levels[sourceNode] = 0;

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
                    if (!Levels.ContainsKey(neighbour))
                    {
                        queue.Enqueue(neighbour);
                        Levels[neighbour] = currnetLevel;
                    }
                }
            }

            return Levels.ContainsKey(destinationNode);
        }

        public long SendFlow(string node, List<SimpleEdge> path, ref HashSet<SimpleEdge> reveresedEdgesToAdd)
        {
            if (node.Equals(destinationNode))
            {
                return UpdateFlow(path, ref reveresedEdgesToAdd);
            }

            long result = 0;

            foreach (var edge in Graph[node])
            {
                if (edge.SourceAccount.Equals(node) && edge.RemainingCapacity > 0
                    && Levels[edge.DestinationAccount] == Levels[node] + 1)
                {
                    path.Add(edge);
                    result += SendFlow(edge.DestinationAccount, path, ref reveresedEdgesToAdd);
                    path.Remove(edge);
                }
            }

            return result;
        }

        public long UpdateFlow(List<SimpleEdge> path, ref HashSet<SimpleEdge> reveresedEdgesToAdd)
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
                    // 
                    // what happens to the one in "DestAcount" 's set? 
                    // TODO refactor:
                    Graph[edge.SourceAccount].TryGetValue(equalReversed, out actualReversed);
                    actualReversed.Flow -= flow;

                }
                else
                {
                    equalReversed.Capacity = edge.Capacity;
                    equalReversed.Flow = 0;

                    reveresedEdgesToAdd.Add(equalReversed);
                }
            }

            return flow;
        }
    }
}