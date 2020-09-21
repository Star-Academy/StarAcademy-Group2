using System;
using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Models;
using ElasticLib.QueryModel;
using System.Linq;
using GraphLogicLib.Models;
using ElasticLib;

namespace GraphLogicLib
{
    public class NetworkBuilder
    {
        private IElasticService ElasticService;
        private string Source;
        private string Destination;
        private int PathMaximumLength;
        private bool CopyMaker;
        private Dictionary<string, int> Levels;
        public Dictionary<string, HashSet<SimpleEdge>> SimpleGraph; // <accountId, edges>
        public HashSet<Node> Nodes { get; set; }
        public HashSet<Edge> Edges { get; set; }
        private HashSet<Node> NeighbourNodes;
        private Dictionary<string, HashSet<Edge>> NeighbourIncomingEdges;
        private Dictionary<string, HashSet<Edge>> NeighbourOutcomingEdges;
        private Dictionary<string, Node> SupersetGrapgh;
        public NetworkBuilder(string source, string destination, int pathMaximumLength, bool copyMaker = false)
        {
            this.Source = source;
            this.Destination = destination;
            this.PathMaximumLength = pathMaximumLength;
            this.CopyMaker = copyMaker;
            this.SimpleGraph = new Dictionary<string, HashSet<SimpleEdge>>();
            this.ElasticService = new ElasticService();
            this.Nodes = new HashSet<Node>();
            this.Edges = new HashSet<Edge>();
            this.NeighbourIncomingEdges = new Dictionary<string, HashSet<Edge>>();
            this.NeighbourOutcomingEdges = new Dictionary<string, HashSet<Edge>>();
            this.NeighbourNodes = new HashSet<Node>();
            this.Levels = new Dictionary<string, int>();
            this.SupersetGrapgh = new Dictionary<string, Node>();
        }
        public void GetNeighbours(string nodes)
        {
            NeighbourNodes.Clear();

            var neighbourNodesId = new HashSet<string>();
            foreach(var edge in ElasticService
                .Search<Edge>(
                    new EdgeSearchQuery()
                    {
                        DestinationAccount = nodes
                    }
                )
            )
            {
                if(Levels.ContainsKey(edge.SourceAccount)){
                    break;
                }
                if(!NeighbourIncomingEdges.ContainsKey(edge.DestinationAccount)){
                    NeighbourIncomingEdges[edge.DestinationAccount] = new HashSet<Edge>();
                }
                if(!NeighbourOutcomingEdges.ContainsKey(edge.SourceAccount)){
                    NeighbourOutcomingEdges[edge.SourceAccount] = new HashSet<Edge>();
                }
                NeighbourOutcomingEdges[edge.SourceAccount].Add(edge);
                NeighbourIncomingEdges[edge.DestinationAccount].Add(edge);
                neighbourNodesId.Add(edge.SourceAccount);
            }

            foreach(var edge in ElasticService
                .Search<Edge>(
                    new EdgeSearchQuery()
                    {
                        SourceAccount = nodes
                    }
                )
            )
            {
                if(Levels.ContainsKey(edge.DestinationAccount)){
                    break;
                }
                if(!NeighbourOutcomingEdges.ContainsKey(edge.SourceAccount)){
                    NeighbourOutcomingEdges[edge.SourceAccount] = new HashSet<Edge>();
                }
                if(!NeighbourIncomingEdges.ContainsKey(edge.DestinationAccount)){
                    NeighbourIncomingEdges[edge.DestinationAccount] = new HashSet<Edge>();
                }
                NeighbourOutcomingEdges[edge.SourceAccount].Add(edge);
                NeighbourIncomingEdges[edge.DestinationAccount].Add(edge);
                neighbourNodesId.Add(edge.DestinationAccount);
            }

            foreach(var node in ElasticService
                .Search<Node>(
                    new NodeSearchQuery()
                    {
                        AccountId = String.Join(' ', neighbourNodesId)
                    }
                )
            )
            {
                NeighbourNodes.Add(node);
                if(!SupersetGrapgh.ContainsKey(node.AccountId)){
                    SupersetGrapgh[node.AccountId] = node;
                }
            }
        }
        public void BfsOnDestination()
        {
            var queue = new HashSet<string>();
            queue.Add(Destination);
            Levels.Add(Destination, 0);
            for (int i = 0; i < PathMaximumLength; i++)
            {
                if (queue.Count == 0)
                {
                    break;
                }
                GetNeighbours(String.Join(" ", queue));
                queue.Clear();
                queue.UnionWith(
                    from node in NeighbourNodes
                    select node.AccountId
                );
                foreach (var node in queue)
                {
                    Levels.Add(node, i + 1);
                }
            }
        }

        public HashSet<SimpleEdge> SimplifyingEdges(HashSet<Edge> incomingEdges, HashSet<Edge> outcomingEdges)
        {
            var output = new HashSet<SimpleEdge>();
            var neighbourEdges = new Dictionary<string, HashSet<Edge>>();
            foreach (var edge in incomingEdges)
            {
                if (!neighbourEdges.ContainsKey(edge.SourceAccount))
                {
                    neighbourEdges[edge.SourceAccount] = new HashSet<Edge>();
                }
                neighbourEdges[edge.SourceAccount].Add(edge);
            }
            foreach (var edge in outcomingEdges)
            {
                if (!neighbourEdges.ContainsKey(edge.DestinationAccount))
                {
                    neighbourEdges[edge.DestinationAccount] = new HashSet<Edge>();
                }
                neighbourEdges[edge.DestinationAccount].Add(edge);
            }
            foreach (var edges in neighbourEdges.Values)
            {
                var defaultEdge = edges.First<Edge>();
                var simpleEdge = new SimpleEdge()
                {
                    SourceAccount = defaultEdge.SourceAccount,
                    DestinationAccount = defaultEdge.DestinationAccount,
                    Capacity = 0
                };
                foreach (var edge in edges)
                {
                    if (edge.SourceAccount.Equals(simpleEdge.SourceAccount))
                    {
                        simpleEdge.Capacity += edge.Amount;
                    }
                    else
                    {
                        simpleEdge.Capacity -= edge.Amount;
                    }
                }
                if (simpleEdge.Capacity < 0)
                {
                    simpleEdge.Capacity *= -1;
                    var tmp = simpleEdge.SourceAccount;
                    simpleEdge.SourceAccount = simpleEdge.DestinationAccount;
                    simpleEdge.DestinationAccount = tmp;
                }
                if(simpleEdge.Capacity != 0){
                    output.Add(simpleEdge);
                }
            }
            return output;
        }
        public void Dfs(string source, int pathLength, HashSet<string> visited, HashSet<Node> historyNode, HashSet<Edge> historyEdge, HashSet<SimpleEdge> historySimpleEdge)
        {
            if (source.Equals(Destination))
            {
                if (CopyMaker)
                {
                    foreach(var edge in historySimpleEdge){
                        if(SimpleGraph.ContainsKey(edge.DestinationAccount)){
                            SimpleGraph[edge.DestinationAccount] = new HashSet<SimpleEdge>();
                        }
                        if(SimpleGraph.ContainsKey(edge.SourceAccount)){
                            SimpleGraph[edge.SourceAccount] = new HashSet<SimpleEdge>();
                        }
                        SimpleGraph[edge.DestinationAccount].Add(edge);
                        SimpleGraph[edge.SourceAccount].Add(edge);
                    }
                }
                Nodes.UnionWith(historyNode);
                Edges.UnionWith(historyEdge);
                return;
            }
            visited.Add(source);

            var incomingEdgesSuperset = new HashSet<Edge>();
            var outcomingEdgesSuperset = new HashSet<Edge>();
            if(NeighbourIncomingEdges.ContainsKey(source)){
                incomingEdgesSuperset.UnionWith(NeighbourIncomingEdges[source]);
            }
            if(NeighbourOutcomingEdges.ContainsKey(source)){
                outcomingEdgesSuperset.UnionWith(NeighbourOutcomingEdges[source]);
            }

            var neighboursSuperset = new HashSet<string>();
            neighboursSuperset.UnionWith(
                from edge in incomingEdgesSuperset
                select edge.SourceAccount
            );
            neighboursSuperset.UnionWith(
                from edge in outcomingEdgesSuperset
                select edge.DestinationAccount
            );

            var neighbours =
                from neighbour in neighboursSuperset
                where !visited.Contains(neighbour)
                where Levels.ContainsKey(neighbour)
                where pathLength + Levels[neighbour] < PathMaximumLength
                select neighbour;
            
            foreach (var neighbour in neighbours)
            {
                var incomingEdges = 
                    from edge in incomingEdgesSuperset
                    where edge.SourceAccount.Equals(neighbour)
                    select edge;

                var outcomingEdges = 
                    from edge in outcomingEdgesSuperset
                    where edge.DestinationAccount.Equals(neighbour)
                    select edge;

                if (CopyMaker)
                {
                    historySimpleEdge.UnionWith(SimplifyingEdges((HashSet<Edge>) incomingEdges, (HashSet<Edge>) outcomingEdges));
                }
                historyNode.Add(SupersetGrapgh[source]);
                historyEdge.UnionWith(incomingEdges);
                historyEdge.UnionWith(outcomingEdges);
                Dfs(neighbour, pathLength + 1, visited, historyNode, historyEdge, historySimpleEdge);
            }
            visited.Remove(source);
        }
        public void Build()
        {
            if(!Destination.Equals(Source)){
                BfsOnDestination();
                if(Levels.ContainsKey(Source)){
                    Dfs(Source, 0, new HashSet<string>(), new HashSet<Node>(), new HashSet<Edge>(), new HashSet<SimpleEdge>());
                }
            }
        }
    }
}