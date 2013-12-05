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

		private CurrentSlide _currentSlide;
		public CurrentSlide CurrentSlide
		{
			get
			{
				return _currentSlide;
			}
			set
			{
                //if this is the first time we've heard from the presentation, it must have just started
                if (_currentSlide == null)
                {
                    StartTime = DateTime.Now;
                }
				_currentSlide = value;

				// may contain a new poll we need to register
				if (CurrentSlide.polls != null)
				{
					foreach (Poll poll in CurrentSlide.polls)
					{
						if (!Polls.ContainsKey(poll.Identifier))
						{
							// add poll to register of polls
							Polls.Add(poll.Identifier, poll);
						}
					}
				}
			}
		}

		/// <summary>
		/// The raw set of all poll answers received during the presentation.
		/// All polls answers are lumped in together. This may be horrible for performance later but it will do for now.
		/// </summary>
		/// PROBABLY WON'T REMAIN PUBLIC: DEBUG ONLY
		public List<PollAnswer> PollAnswers = new List<PollAnswer>();

		/// <summary>
		/// This maintains a set of polls the server currnetly knows about
		/// This will be added to piecemeal as new polls are discovered by virtue
		/// of the presenter navigating through the presentation
		/// </summary>
		public Dictionary<string, Poll> Polls = new Dictionary<string, Poll>();

		/// <summary>
		/// Method takes a new answer and does something useful with it
		/// </summary>
		/// <param name="pollAnswer"></param>
		public void AddPollAnswer(PollAnswer pollAnswer)
		{
			// log the raw answer
			PollAnswers.Add(pollAnswer);

			// find the poll
			if (!Polls.ContainsKey(pollAnswer.PollIdentifier)) throw new Exception("Answer for unknown poll?");

			foreach (PollOption selectedPollOption in pollAnswer.SelectedOptions)
			{
				Poll poll = Polls[pollAnswer.PollIdentifier];
				foreach (PollOption po in poll.Options)
				{
					if (po.OptionID == selectedPollOption.OptionID)
						po.Count = (po.Count == null) ? 1 : (po.Count + 1);
				}
			}
		}

        public PresentationTimer Timer { get;internal set; }

        public void StartTimer()
        {
            Timer = new PresentationTimer();
        }

	}
}