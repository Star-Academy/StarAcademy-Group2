using System.Collections.Generic;

namespace DOLib
{
    public class Entity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Dictionary<string, object> Attributes;

        public Entity()
        {
            Attributes = new Dictionary<string, object>();
        }

        public void AddAttribute(string id, object value)
        {
            Attributes.Add(id, value);
        }
    }
}
