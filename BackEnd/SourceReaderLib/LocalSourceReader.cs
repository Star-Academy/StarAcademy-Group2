using System;
using System.IO;

namespace SourceReaderLib
{
    public class LocalSourceReader
    {
        public string[] Read(string url)
        {
            return File.ReadAllLines(url);
        }
    }
}
