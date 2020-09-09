using System.Collections.Generic;

namespace MyWebApi.Models
{
    public class Node
    {
        public string OwnerName;
        public string OwnerFamilyName;
        public string BranchName;
        public int OwnerId;
        public string BranchAddress;
        public string BranchTelephone;
        public string AccountType;
        public string Sheba;
        public int CardId;
        public int AccountId;
        public Edge[] Edges;

        public override string ToString()
        {
            return base.ToString();
        }
    }
}