using System;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib.Models;
using GraphLogicLib;


namespace Test.GraphLogicLib
{
    public class GraphLogicLibTest
    {
        MaxFlowFinder maxFlowFinder;

        [Theory]
        [MemberData(nameof(FlowTestData))]
        public void FlowTest(Dictionary<string, HashSet<SimpleEdge>> graph
                            , string src, string dst, long expected)
        {
            maxFlowFinder = new MaxFlowFinder(src, dst);
            maxFlowFinder.Graph = graph; 

            Assert.Equal(expected, maxFlowFinder.Find());
        }

        public static IEnumerable<object[]> FlowTestData =>
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
                    1, 5, 1
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
