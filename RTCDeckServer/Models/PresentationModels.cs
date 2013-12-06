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
		private static Lazy<PresentationState> _instance = new Lazy<PresentationState>(() => new PresentationState());

		public static PresentationState Instance
		{
			get { return _instance.Value; }
		}

        public static void Reset()
        {
            _instance = new Lazy<PresentationState>(() => new PresentationState());
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
        /// Stores the connection IDs that requested a poll answer before the poll was initialised
        /// </summary>
        public Dictionary<string, ISet<string>> PollAnswerRequests = new Dictionary<string, ISet<string>>();

        /// <summary>
        /// Record the fact that we were requested the details for a poll but haven't yet sent them out
        /// [likely due to the fact we don't know about the poll yet]
        /// </summary>
        /// <param name="pollID">The ID of the poll</param>
        /// <param name="connectionID">The connection ID of the requester</param>
        public void StoreUnansweredPollAnswerRequest(string pollID, string connectionID)
        {
            if (!PollAnswerRequests.ContainsKey(pollID))
                PollAnswerRequests.Add(pollID, new HashSet<string>());
            PollAnswerRequests[pollID].Add(connectionID);
        }

        /// <summary>
        /// Gets the list of unanswered poll requests and removes them from the list
        /// </summary>
        /// <param name="pollID"></param>
        /// <returns></returns>
        public ICollection<string> GetAndRemoveUnansweredPollAnswerRequests(string pollID)
        {
            ICollection<string> requests = PollAnswerRequests.ContainsKey(pollID) ? PollAnswerRequests[pollID] : new HashSet<string>();
            PollAnswerRequests[pollID] = new HashSet<string>();
            return requests;
        }

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