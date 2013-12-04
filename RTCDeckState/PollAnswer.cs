using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RTCDeckState
{
	public class PollAnswer
	{
		/// <summary>
		/// unique ID for poll answer 
		/// </summary>
		public Guid AnswerID = Guid.NewGuid();

		/// <summary>
		/// The poll's identifier; defined in slide config, and 
		/// used to group the poll's answers
		/// </summary>
		public string PollIdentifier { get; set; }

		/// <summary>
		/// The answer options; may be more than one in the case of multi-choice
		/// </summary>
		public List<PollOption> SelectedOptions { get; set; }

		/// <summary>
		/// When was the answer submitted?
		/// </summary>
		public DateTime Timestamp = DateTime.Now;

		/// <summary>
		/// Who submitted the answer?
		/// </summary>
		public string ConnectionId { get; set; }
	}
}
