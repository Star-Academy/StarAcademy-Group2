using System;
using System.IO;

namespace SourceReaderLib.SourceReader
{
    public class LocalSourceReader: ISourceReader
    {
        public string[] Read(string url)
        {
            return File.ReadAllLines(url);
        }
    }
}
