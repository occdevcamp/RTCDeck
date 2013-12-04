using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RTCDeckState
{
    public class CurrentSlide
    {
		public int indexh { get; set; }
		public int indexv { get; set; }
		public int indexf { get; set; } // initially unsupported, assumed necessary for fragments later
		//public string slideContent { get; set; } // not necessary: any presenter view is based on the main page
		public string speakerNotes { get; set; }
		public string supplementaryContent { get; set; }
		public List<Poll> polls { get; set; }
    }
}
