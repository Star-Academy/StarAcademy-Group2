using GraphLogicLib;
using Xunit;
using System.Collections.Generic;
using GraphLogicLib.Models;
using ElasticLib.Models;

namespace Test.GraphLogicLib.NetworkBuilderTest
{
    public class SimplifyingEdgesTest
    {
        NetworkBuilder networkBuilder;

        [Theory]
        [MemberData(nameof(SimplifyingEdgesTestData))]
        public void Test(HashSet<Edge> incomingEdges, HashSet<Edge> outcomingEdges, HashSet<SimpleEdge> expected)
        {
            networkBuilder = new NetworkBuilder("sth", "sth", 0, false);
            Assert.Equal(expected, networkBuilder.SimplifyingEdges(incomingEdges, outcomingEdges));
        }

        public static IEnumerable<object[]> SimplifyingEdgesTestData =>
            new List<object[]>
            {
                new object[]
                {
                    new HashSet<Edge>
                    {
                        new Edge()
                        {
                            SourceAccount = "1",
                            DestinationAccount = "0",
                            Amount = 500
                        },
                        new Edge()
                        {
                            SourceAccount = "1",
                            DestinationAccount = "0",
                            Amount = 400
                        },
                        new Edge()
                        {
                            SourceAccount = "2",
                            DestinationAccount = "0",
                            Amount = 100
                        },
                        new Edge()
                        {
                            SourceAccount = "2",
                            DestinationAccount = "0",
                            Amount = 200
                        },
                    },
                    new HashSet<Edge>
                    {
                        new Edge()
                        {
                            SourceAccount = "0",
                            DestinationAccount = "1",
                            Amount = 1300
                        },
                        new Edge()
                        {
                            SourceAccount = "0",
                            DestinationAccount = "2",
                            Amount = 150
                        },
                        new Edge()
                        {
                            SourceAccount = "0",
                            DestinationAccount = "2",
                            Amount = 25
                        },
                    },
                    new HashSet<SimpleEdge>
                    {
                        new SimpleEdge()
                        {
                            SourceAccount = "0",
                            DestinationAccount = "1",
                            Capacity = 400
                        },
                        new SimpleEdge()
                        {
                            SourceAccount = "2",
                            DestinationAccount = "0",
                            Capacity = 125
                        }
                    }
                }
            };
    }
}