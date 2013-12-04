using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using RTCDeckServer.Hubs;
using RTCDeckState;

namespace RTCDeckServer.Models
{
	public class PresentationState
	{
		// Singleton instance
		private readonly static Lazy<PresentationState> _instance = new Lazy<PresentationState>(() => new PresentationState());

		public static PresentationState Instance
		{
			get { return _instance.Value; }
		}

		public CurrentSlide CurrentSlide { get; set; }

		/// <summary>
		/// The raw set of all poll answers received during the presentation.
		/// All polls answers are lumped in together. This may be horrible for performance later but it will do for now.
		/// </summary>
		/// PROBABLY WON'T REMAIN PUBLIC: DEBUG ONLY
		public List<PollAnswer> PollAnswers { get; set; }

		/// <summary>
		/// A set of aggregated answers for quick retrieval
		/// </summary>
		public Dictionary<string,PollAnswerSummary> PollAnswerSummaries { get; set; }
		
		/// <summary>
		/// Method takes a new answer and does something useful with it
		/// </summary>
		/// <param name="pollAnswer"></param>
		public void AddPollAnswer(PollAnswer pollAnswer)
		{
			// log the raw answer
			PollAnswers.Add(pollAnswer);

			// add to aggregate of answers for this particular poll
			// do we know about this poll yet?
			// TO DO: Work out that raw logging is working first! Small steps Tom
			/*
			PollAnswerSummary pas;
			if (!PollAnswerSummaries.ContainsKey(pollAnswer.PollIdentifier))
				pas = PollAnswerSummaries[pollAnswer.PollIdentifier];
			else
			{
				pas = new PollAnswerSummary();
			}
			*/
			// add answer to summary
		}
	}
}