using System;
using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Models;
using ElasticLib.QueryModel;
using System.Linq;
using GraphLogicLib.Models;

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
        private NetworkBuilder(IElasticService elasticService) //??????????????
        {
            this.ElasticService = elasticService;
        }
        public NetworkBuilder(string source, string destination, int pathMaximumLength = 5, bool copyMaker = false)
        {
            this.Source = source;
            this.Destination = destination;
            this.PathMaximumLength = pathMaximumLength;
            this.CopyMaker = copyMaker;
            this.SimpleGraph = new Dictionary<string, HashSet<SimpleEdge>>();

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
                var nextLevelQueue = new HashSet<string>();
                var currentLevelNodes = String.Join(" ", queue);
                nextLevelQueue.UnionWith(
                    from node in GetNeighbours(currentLevelNodes)
                    where levels.ContainsKey(node.AccountId) is false //?????????
                    select node.AccountId
                );
                foreach (var node in queue)
                {
                    levels.Add(node, i);
                    queue.Remove(node);
                }
                queue.UnionWith(nextLevelQueue);
            }
            Levels = levels;
        }

        public HashSet<SimpleEdge> SimplifyingEdges(HashSet<Edge> incomingEdges, HashSet<Edge> outcomingEdges)
        {
            var output = new HashSet<SimpleEdge>();
            var neighbourEdges = new Dictionary<string, HashSet<SimpleEdge>>();
            foreach (var edge in incomingEdges)
            {
                if (!neighbourEdges.ContainsKey(edge.SourceAccount))
                {
                    neighbourEdges[edge.SourceAccount] = new HashSet<SimpleEdge>();
                }
                neighbourEdges[edge.SourceAccount].Add(new SimpleEdge()
                {
                    SourceAccount = edge.SourceAccount,
                    DestinationAccount = edge.DestinationAccount,
                    Capacity = edge.Amount
                });
            }
            foreach (var edge in outcomingEdges)
            {
                if (!neighbourEdges.ContainsKey(edge.DestinationAccount))
                {
                    neighbourEdges[edge.DestinationAccount] = new HashSet<SimpleEdge>();
                }
                neighbourEdges[edge.DestinationAccount].Add(new SimpleEdge()
                {
                    SourceAccount = edge.SourceAccount,
                    DestinationAccount = edge.DestinationAccount,
                    Capacity = edge.Amount
                });
            }
            foreach (var edges in neighbourEdges.Values)
            {
                var defaultEdge = edges.First<SimpleEdge>();
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
                        simpleEdge.Capacity += edge.Capacity;
                    }
                    else
                    {
                        simpleEdge.Capacity += edge.Capacity;
                    }
                }
                if (simpleEdge.Capacity < 0)
                {
                    simpleEdge.Capacity *= -1;
                    var tmp = simpleEdge.SourceAccount;
                    simpleEdge.SourceAccount = simpleEdge.DestinationAccount;
                    simpleEdge.DestinationAccount = tmp;
                }
                output.Add(simpleEdge);
            }
            return output;
        }
        public void Dfs(Node source, int pathLength, HashSet<string> visited)
        {
            if (source.AccountId.Equals(Destination))
            {
                return;
            }
            visited.Add(source.AccountId);
            var neighbours =
                from node in GetNeighbours(source.AccountId)
                where !visited.Contains(node.AccountId) //???????????????????????
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
                }
                Nodes.Add(source);
                Edges.UnionWith(incomingEdges); //can be improved
                Edges.UnionWith(outcomingEdges);
                Dfs(neighbour, pathLength + 1, visited);
            }
            visited.Remove(source.AccountId);
        }
        public void Build()
        {
            BfsOnDestination();
            Dfs(ElasticService.Search<Node>(new NodeSearchQuery() {AccountId = Source}).First<Node>(), 0, new HashSet<string>());
        }
    }
}