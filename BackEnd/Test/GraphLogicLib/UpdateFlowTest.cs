using System;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib.Models;
using GraphLogicLib;


namespace Test.GraphLogicLib
{
    public class UpdateFlowTest
    {
        MaxFlowFinder maxFlowFinder;

        [Theory]
        [MemberData(nameof(UpdateFlowTestData))]
        public void Test(Dictionary<string, HashSet<SimpleEdge>> graph,
                         List<SimpleEdge> path,
                         Dictionary<SimpleEdge, long> expectedFlowsOnEdges, long expectedFlow)
        {
            maxFlowFinder = new MaxFlowFinder("1", "2"); //some dum shit
            maxFlowFinder.Graph = graph; 

            var reveresedEdgesToAdd = new HashSet<SimpleEdge>();
            Assert.Equal(expectedFlow, maxFlowFinder.UpdateFlow(path, ref reveresedEdgesToAdd));
            foreach(var edge in path)
                Assert.Equal(expectedFlowsOnEdges[edge],edge.Flow);
        }

        public static IEnumerable<object[]> UpdateFlowTestData =>
            new List<object[]>  
            {
                // 1 2 1 
                // 3 2 2 
                // 2 5 5
                // 4 2 3 
                new object[] 
                {
                    new Dictionary<string, HashSet<SimpleEdge>>()
                    {
                        {"1",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 1} 
                                }
                        },
                        {"2",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 1},
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 2},
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5", Capacity = 5},
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "2", Capacity = 3}   
                                }
                        },
                        {"3",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 2}
                                }
                        },
                        {"4",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "2", Capacity = 3}   
                                }
                        },
                        {"5",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5", Capacity = 5},
                                }
                        },
                    },
                    new List<SimpleEdge>()
                    {
                        new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 1} ,
                        new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5", Capacity = 5}
                    },
                    new Dictionary<SimpleEdge, long>()
                    {
                        {new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2"}, 1},
                        {new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5"}, 1}
                    },
                    1
                }
                // ,
                // new object[] 
                // {

                // },
                // new object[] 
                // {

                // },
                // new object[] 
                // {

                // },
                // new object[] 
                // {

                // }
            };
    }
}

