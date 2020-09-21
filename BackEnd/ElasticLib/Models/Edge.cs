using System;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using Nest;

namespace ElasticLib.Models
{
    public class Edge
    {
        [JsonPropertyName("SourceAccount")]
        public string SourceAccount { get; set; }

        [JsonPropertyName("DestinationAccount")]
        public string DestinationAccount { get; set; }

        [Ignore]
        [JsonPropertyName("Amount")]
        public string StringAmount {
            get => Amount.ToString();

            set => Amount = long.Parse(value, NumberStyles.AllowThousands);
        }

        [JsonIgnore]
        public long Amount { get; set; }

        [Ignore]
        [JsonPropertyName("Date")]
        public string Date { get; set; }

        [Ignore]
        [JsonPropertyName("Time")]
        public string Time { get; set; }

        [JsonIgnore]
        [Date(Name = "date")]
        public DateTime DateAndTime
        {
            get => ClearDate(Date, Time);
            set
            {
                var info = value.ToString("yyyy-MM-ddThh:mm:ss").Split('T');
                Date = info[0];
                Time = info[1];
            }
        }

        [JsonPropertyName("TransactionID")]
        public string TransactionId { get; set; }

        [JsonPropertyName("Type")]
        public string Type { get; set; }

        public DateTime ClearDate(string date, string time)
        {
            var dateInfo = date.Split('/');
            var timeInfo = time.Split(':');
            var year = int.Parse(dateInfo[2]);
            var month = int.Parse(dateInfo[0]);
            var day = int.Parse(dateInfo[1]);
            var hour = int.Parse(timeInfo[0]);
            var minute = int.Parse(timeInfo[1]);
            var second = int.Parse(timeInfo[2]);
            // var result = $"{dateInfo[2]}-{month}-{day} {hour}:{minute}:{second}";
            if (month == 2 && day > 28 && !DateTime.IsLeapYear(year))
            {
                Console.WriteLine("=_=");
                day = 28;
            }
            var result = new DateTime(year, month, day, hour, minute, second);
            return result;
        }
    }
}
