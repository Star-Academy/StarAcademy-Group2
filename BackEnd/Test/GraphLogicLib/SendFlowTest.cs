// using System;
// using Xunit;
// using System.Collections.Generic;
// using System.Linq;
// using GraphLogicLib.Models;
// using GraphLogicLib;


// namespace Test.GraphLogicLib
// {
//     public class SendFlowTest
//     {
//         MaxFlowFinder maxFlowFinder;

//         [Theory]
//         [MemberData(nameof(SendFlowTestData))]
//         public void Test(Dictionary<string, HashSet<SimpleEdge>> graph,
//                          string src, string dst,
//                          Dictionary<SimpleEdge, long> expectedFlowsOnEdges, long expectedFlow)
//         {
//             maxFlowFinder = new MaxFlowFinder(src, dst);
//             maxFlowFinder.Graph = graph; 

//             maxFlowFinder.Bfs();
            
//             Assert.Equal(expectedFlow, maxFlowFinder.SendFlow(src, new List<SimpleEdge>()), new HashSet);
//             foreach(var set in graph.Values)
//                 foreach(var edge in set)
//                     Assert.Equal(expectedFlowsOnEdges[edge],edge.Flow);
//         }

//         public static IEnumerable<object[]> SendFlowTestData =>
//             new List<object[]>  
//             {
//                 // 1 2 1 
//                 // 3 2 2 
//                 // 2 5 5
//                 // 4 2 3 
//                 new object[] 
//                 {
//                     new Dictionary<string, HashSet<SimpleEdge>>()
//                     {
//                         {"1",new HashSet<SimpleEdge>()
//                                 {
//                                     new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 1, Flow = 0} 
//                                 }
//                         },
//                         {"2",new HashSet<SimpleEdge>()
//                                 {
//                                     new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2", Capacity = 1, Flow = 0},
//                                     new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 2, Flow = 0},
//                                     new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5", Capacity = 5, Flow = 0},
//                                     new SimpleEdge() {SourceAccount = "4", DestinationAccount = "2", Capacity = 3, Flow = 0}   
//                                 }
//                         },
//                         {"3",new HashSet<SimpleEdge>()
//                                 {
//                                     new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2", Capacity = 2, Flow = 0}
//                                 }
//                         },
//                         {"4",new HashSet<SimpleEdge>()
//                                 {
//                                     new SimpleEdge() {SourceAccount = "4", DestinationAccount = "2", Capacity = 3, Flow = 0}   
//                                 }
//                         },
//                         {"5",new HashSet<SimpleEdge>()
//                                 {
//                                     new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5", Capacity = 5, Flow = 0},
//                                 }
//                         },
//                     },
//                     '1', '5',
//                     new Dictionary<SimpleEdge, long>()
//                     {
//                         {new SimpleEdge() {SourceAccount = "1", DestinationAccount = "2"}, 1},
//                         {new SimpleEdge() {SourceAccount = "2", DestinationAccount = "5"}, 1},

//                         {new SimpleEdge() {SourceAccount = "3", DestinationAccount = "2"}, 0},
//                         {new SimpleEdge() {SourceAccount = "4", DestinationAccount = "2"}, 0}   
//                     },
//                     1
//                 }
//                 // ,
//                 // new object[] 
//                 // {

//                 // },
//                 // new object[] 
//                 // {

//                 // },
//                 // new object[] 
//                 // {

//                 // },
//                 // new object[] 
//                 // {

//                 // }
//             };
//     }
// }

