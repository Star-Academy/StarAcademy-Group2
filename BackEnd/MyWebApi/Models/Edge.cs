namespace MyWebApi.Models
{
    public class Edge
    {
        public string SrcAcc;
        public string DstAcc; //recursively sending all the component alert so use ToString methode
        public int Amount;
        public string Date;
        public long TransactionId;
        public string Type;
    }
}