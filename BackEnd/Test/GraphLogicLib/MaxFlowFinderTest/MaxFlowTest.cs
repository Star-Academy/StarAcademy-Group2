using System;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using GraphLogicLib.Models;
using GraphLogicLib;


namespace Test.GraphLogicLib.MaxFlowFinderTest
{
    public class MaxFlowTest
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
                /* 
                   s d w
                   1 2 1 
                   3 2 2 
                   2 5 5
                   4 2 3 
                */
                new object[]
                {
                    new Dictionary<string, HashSet<SimpleEdge>>()
                    {
                        {"1",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 1, Flow = 0}
                                }
                        },
                        {"2",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 1, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 2, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5", Capacity = 5, Flow = 0},
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
                        {"5",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5", Capacity = 5, Flow = 0},
                                }
                        },
                    },
                    1, 5, 1
                },

                /*
                    1 2 8 
                    1 3 10
                    2 4 2 
                    3 4 3
                */
                new object[]
                {
                    new Dictionary<string, HashSet<SimpleEdge>>()
                    {
                        {"1",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 8, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "3", Capacity = 10, Flow = 0}
                                }
                        },
                        {"2",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 8, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "4", Capacity = 2, Flow = 0}
                                }
                        },
                        {"3",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "3", Capacity = 10, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "4", Capacity = 3, Flow = 0}                                
                                }
                        },
                        {"4",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "4", Capacity = 3, Flow = 0}                                
                                }
                        }
                    },
                    1, 4, 5
                },

                new object[] 
                {
                    new Dictionary<string, HashSet<SimpleEdge>>()
                    {
                        {"1",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 16, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "3", Capacity = 13, Flow = 0}
                                }
                        },
                        {"2",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 16, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "3", Capacity = 10, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "4", Capacity = 12, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 4, Flow = 0}

                                }
                        },
                        {"3",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "1", DestinationAccount = "3", Capacity = 13, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "3", Capacity = 10, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 4, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "5", Capacity = 14, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "3", Capacity = 9, Flow = 0}

                                }
                        },
                        {"4",new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "2", DestinationAccount = "4", Capacity = 12, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "3", Capacity = 9, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "6", Capacity = 20, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "5", DestinationAccount = "4", Capacity = 7, Flow = 0}
                                
                                }
                        },
                        {"5", new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "3", DestinationAccount = "5", Capacity = 14, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "5", DestinationAccount = "6", Capacity = 4, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "5", DestinationAccount = "4", Capacity = 7, Flow = 0}
                                
                                }
                        },
                        {"6", new HashSet<SimpleEdge>()
                                {
                                    new SimpleEdge() {SourceAccount = "4", DestinationAccount = "6", Capacity = 20, Flow = 0},
                                    new SimpleEdge() {SourceAccount = "5", DestinationAccount = "6", Capacity = 4, Flow = 0}
                                
                                }
                        }
                    },
                    1, 6, 23

                },
                // new object[] 
                // {

                // }
            };
    }
}

