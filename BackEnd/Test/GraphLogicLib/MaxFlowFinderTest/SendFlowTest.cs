using System;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib.Models;
using GraphLogicLib;


namespace Test.GraphLogicLib.MaxFlowFinderTest
{
    public class SendFlowTest
    {
        MaxFlowFinder maxFlowFinder;

        [Theory]
        [MemberData(nameof(SendFlowTestData))]
        public void Test(Dictionary<string, HashSet<SimpleEdge>> graph, long expectedFlow)
        {
            maxFlowFinder = new MaxFlowFinder();
            maxFlowFinder.Graph = graph; 

            maxFlowFinder.Bfs();
            
            var reveresedEdgesToAdd = new HashSet<SimpleEdge>();
            Assert.Equal(expectedFlow, maxFlowFinder.SendFlow("s", new List<SimpleEdge>(), ref reveresedEdgesToAdd));
        }

        public static IEnumerable<object[]> SendFlowTestData =>
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
                        {"s",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "s", DestinationAccount = "2", Capacity = 1, Flow = 0} 
                                }
                        },
                        {"2",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "s", DestinationAccount = "2", Capacity = 1, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 2, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "t", Capacity = 5, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "2", Capacity = 3, Flow = 0}   
                                }
                        },
                        {"3",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 2, Flow = 0}
                                }
                        },
                        {"4",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "2", Capacity = 3, Flow = 0}   
                                }
                        },
                        {"t",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "t", Capacity = 5, Flow = 0},
                                }
                        },
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

