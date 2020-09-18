using Newtonsoft.Json.Linq;

namespace DOLib
{
    public class EntityExtractor
    {
        public Entity Extract(string schema)
        {
            var entity = new Entity();
            var info = JObject.Parse(schema);
            entity.Name = info["_type"]?.ToString();
            foreach (var attribute in info?["attributes"])
            {
                entity.AddAttribute(attribute["attributeName"]?.ToString(), null);
                //TODO -> what to do with {attributeType} ???
            }

            return entity;
        }
    }
}
