using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RTCDeckState
{
	public class Poll
	{
		/// <summary>
		/// Identifier in case we want to support more than one 
		/// question per slide
		/// </summary>
		public string Identifier { get; set; }
		
		/// <summary>
		/// Question to present
		/// E.g. "Is this slide helpful?"
		/// </summary>
		public string Question { get; set; }

		/// <summary>
		/// Type of poll
		/// Anticipate using this to select a display template that is 
		/// different for ThumbsUpThumbsDown / Radio / Multchoice etc
		/// </summary>
		public string Style { get; set; }

		/// <summary>
		/// Poll options.
		/// For Thumbs Up / Thumbs Down, we'll have two, both using image paths
		/// For multi-choice polls we need more options. Simples.
		/// </summary>
		public List<PollOption> Options { get; set; }
	}

	/// <summary>
	/// A PollOption is a potential answer.
	/// Either specify the image path (e.g. for thumbup / thumbdown)
	/// or options text e.g. "Bananas", "Apples".
	/// </summary>
	public class PollOption {
		public int OptionID { get; set; }
		public string OptionImagePath {get; set;}
		public string OptionText {get; set;}
		public int Count { get; set; }
        public string OptionStyle { get; set; }
	}

	public static class PollStyle
	{
        public const string ThumbsUpThumbsDown = "ThumbsUpThumbsDown";
		// no further options yet but we'll probably want to 
		// add support for Radio options / Multiple choice
		// Radio,
		// MultiChoice,
	}
}
