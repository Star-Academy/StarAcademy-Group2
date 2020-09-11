namespace MyWebApi.Models
{
    public class Edge
    {
        public Node SourceAcount;
        public Node DestiantionAccount; //recursively sending all the component alert so use ToString methode
        public long Amount;
        public string Date;
        public long TransactionId;
        public string Type;
    }
}