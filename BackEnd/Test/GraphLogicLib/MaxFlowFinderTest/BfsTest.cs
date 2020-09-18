using System;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib.Models;
using GraphLogicLib;


namespace Test.GraphLogicLib.MaxFlowFinderTest
{
    public class BfsTest
    {
        MaxFlowFinder maxFlowFinder;

        [Theory]
        [MemberData(nameof(BfsTestData))]
        public void Test(Dictionary<string, HashSet<SimpleEdge>> graph
                            , string src, string dst, Dictionary<string, int> expected)
        {
            maxFlowFinder = new MaxFlowFinder(src, dst);
            maxFlowFinder.Graph = graph; 

            Assert.True(maxFlowFinder.Bfs()); //yeah this could be better
            Assert.Equal(expected, maxFlowFinder.Levels);
        }

        public static IEnumerable<object[]> BfsTestData =>
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
                    1, 5,
                    new Dictionary<string, int>()
                    {
                        {"1", 0},
                        {"2", 1},
                        {"5", 2}
                    }
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
