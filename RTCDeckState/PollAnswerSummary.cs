using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RTCDeckState
{
	/// <summary>
	/// This represents a collection of results for a poll for presentation 
	/// by graph, etc.
	/// </summary>
	public class PollAnswerSummary
	{
		/// <summary>
		/// The poll's identifier; defined in slide config, and 
		/// used to group the poll's answers
		/// </summary>
		public string PollIdentifier { get; set; }

		/// <summary>
		/// The answer options; may be more than one in the case of multi-choice
		/// </summary>
		public List<PollAnswerSummaryItem> Answers { get; set; }

	}

	/// <summary>
	/// This represents a point on the poll summary graph [e.g. Thumbs Up: 24]
	/// </summary>
	public class PollAnswerSummaryItem
	{
		public PollOption Option { get; set; }
		public int Count { get; set; }
	}
}
