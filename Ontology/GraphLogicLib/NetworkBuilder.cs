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
        }
        public HashSet<Node> GetNeighbours(string nodes)
        {
            var output = new HashSet<Node>();
            foreach (var edge in ElasticService.Search<Edge>(
                new EdgeSearchQuery()
                {
                    DestinationAccount = nodes
                }
            ))
            {
                output.UnionWith(
                    from acc in ElasticService.Search<Node>(
                        new NodeSearchQuery()
                        {
                            AccountId = edge.SourceAccount
                        }
                    )
                    select acc
                );
            }
            foreach (var edge in ElasticService.Search<Edge>(
                new EdgeSearchQuery()
                {
                    SourceAccount = nodes
                }
            ))
            {
                output.UnionWith(
                    from acc in ElasticService.Search<Node>(
                        new NodeSearchQuery()
                        {
                            AccountId = edge.DestinationAccount
                        }
                    )
                    select acc
                );
            }
            return output;
        }
        public void BfsOnDestination()
        {
            var levels = new Dictionary<string, int>();
            var queue = new HashSet<string>();
            queue.Add(Destination);
            for (int i = 0; i < PathMaximumLength; i++)
            {
                if (queue.Count == 0)
                {
                    break;
                }
                foreach (var node in queue)
                {
                    levels.Add(node, i);
                }
                var nextLevelQueue = new HashSet<string>();
                var currentLevelNodes = String.Join(" ", queue);
                nextLevelQueue.UnionWith(
                    from node in GetNeighbours(currentLevelNodes)
                    where !levels.ContainsKey(node.AccountId) //?????????
                    select node.AccountId
                );
                queue.Clear();
                queue.UnionWith(nextLevelQueue);
            }
            Levels = levels;
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
        public void Dfs(Node last, Node source, int pathLength, HashSet<string> visited)
        {
            if (source.AccountId.Equals(Destination))
            {
                if (CopyMaker)
                {
                    SimpleGraph[source.AccountId] = new HashSet<SimpleEdge>();
                    if(last != null){
                        SimpleGraph[source.AccountId].UnionWith(
                            from edge in SimpleGraph[last.AccountId]
                            where edge.DestinationAccount == source.AccountId
                            select edge
                        );
                        SimpleGraph[source.AccountId].UnionWith(
                            from edge in SimpleGraph[last.AccountId]
                            where edge.SourceAccount == source.AccountId
                            select edge
                        );
                    }
                }
                return;
            }
            visited.Add(source.AccountId);
            var neighbours =
                from node in GetNeighbours(source.AccountId)
                where !visited.Contains(node.AccountId) //???????????????????????
                where Levels.ContainsKey(node.AccountId)
                where Levels[node.AccountId] <= Levels[source.AccountId]
                where pathLength + Levels[node.AccountId] < PathMaximumLength
                select node;

            foreach (var neighbour in neighbours)
            {
                var incomingEdges = new HashSet<Edge>(
                    ElasticService.Search<Edge>(
                        new EdgeSearchQuery()
                        {
                            SourceAccount = neighbour.AccountId,
                            DestinationAccount = source.AccountId
                        }
                    )
                );
                var outcomingEdges = new HashSet<Edge>(
                    ElasticService.Search<Edge>(
                        new EdgeSearchQuery()
                        {
                            SourceAccount = source.AccountId,
                            DestinationAccount = neighbour.AccountId
                        }
                    )
                );
                if (CopyMaker)
                {
                    SimpleGraph[source.AccountId] = SimplifyingEdges(incomingEdges, outcomingEdges);
                    if(last != null){
                        SimpleGraph[source.AccountId].UnionWith(
                            from edge in SimpleGraph[last.AccountId]
                            where edge.DestinationAccount == source.AccountId
                            select edge
                        );
                        SimpleGraph[source.AccountId].UnionWith(
                            from edge in SimpleGraph[last.AccountId]
                            where edge.SourceAccount == source.AccountId
                            select edge
                        );
                    }
                }
                Nodes.Add(source);
                Edges.UnionWith(incomingEdges); //can be improved
                Edges.UnionWith(outcomingEdges);
                Dfs(source, neighbour, pathLength + 1, visited);
            }

            visited.Remove(source.AccountId);
        }
        public void Build()
        {
            BfsOnDestination();
            Dfs(null, ElasticService.Search<Node>(new NodeSearchQuery() {AccountId = Source}).First<Node>(), 0, new HashSet<string>());
        }
    }
}