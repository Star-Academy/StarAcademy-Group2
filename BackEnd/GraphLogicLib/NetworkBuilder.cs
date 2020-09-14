using System;
using System.Collections.Generic;
using ElasticLib.Abstraction;
using ElasticLib.Models;
using ElasticLib.QueryModel;
using System.Linq;

namespace GraphLogicLib{
    public class NetworkBuilder{

        private IElasticService ElasticService;
        private Node Source;
        private string Destination;
        private int PathMaximumLength;
        private bool CopyMaker;
        private Dictionary<string, int> Levels;
        public HashSet<Node> Nodes {get; set;}
        public HashSet<Edge> Edges {get; set;}
        private NetworkBuilder(IElasticService elasticService) //??????????????
        {
            this.ElasticService = elasticService;
        }
        public NetworkBuilder(Node source, string destination, int pathMaximumLength = 5, bool copyMaker = false){
            this.Source = source;
            this.Destination = destination;
            this.PathMaximumLength = pathMaximumLength;
            this.CopyMaker = copyMaker;
        }
        public HashSet<Node> GetNeighbours(string nodes){
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
        public void BfsOnDestination(){
            var levels = new Dictionary<string, int>();
            var queue = new HashSet<string>();
            queue.Add(Destination);
            for(int i = 0; i < PathMaximumLength; i++){
                var nextLevelQueue = new HashSet<string>();
                var currentLevelNodes = String.Join(" ", queue);
                nextLevelQueue.UnionWith(
                    from node in GetNeighbours(currentLevelNodes)
                    where levels.ContainsKey(node.AccountId) is false
                    select node.AccountId
                );
                foreach(var node in queue){
                    levels.Add(node, i);
                    queue.Remove(node);        
                }
                queue.UnionWith(nextLevelQueue);
            }
            Levels = levels;
        }

        public void Dfs(Node source, int pathLength, HashSet<string> visited){
            if(source.AccountId.Equals(Destination)){
                return;
            }
            visited.Add(source.AccountId);
            var neighbours = 
                from node in GetNeighbours(source.AccountId)
                where !visited.Contains(node.AccountId)
                where pathLength + Levels[node.AccountId] < PathMaximumLength
                select node;
            
            foreach(var neighbour in neighbours){
                Nodes.Add(source);
                Edges.UnionWith(
                    ElasticService.Search<Edge>(
                        new EdgeSearchQuery()
                        {
                            DestinationAccount = source.AccountId,
                            SourceAccount = neighbour.AccountId
                        }
                    )
                );
                Edges.UnionWith(
                    ElasticService.Search<Edge>(
                        new EdgeSearchQuery()
                        {
                            DestinationAccount = neighbour.AccountId,
                            SourceAccount = source.AccountId
                        }
                    )
                );
                Dfs(neighbour, pathLength + 1, visited);
            }
            visited.Remove(source.AccountId);
        }
        public void Build(){
            BfsOnDestination();
            var nodes = new HashSet<Node>();
            var edges = new HashSet<Edge>();
            var visited = new HashSet<string>();
            Dfs(Source, 0, visited);
        }
    }
}