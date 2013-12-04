using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using RTCDeckServer.Models;
using RTCDeckState;

namespace RTCDeckServer.Hubs
{
	[HubName(SharedConstants.HUB_NAME)]
	public class RTCDeckHub : Hub
	{
		private readonly PresentationState _presentationState;

		/// <summary>
		/// initialise hub with current state
		/// </summary>
		public RTCDeckHub() : this(PresentationState.Instance) { }
		public RTCDeckHub(PresentationState presentationState)
		{
			_presentationState = presentationState;
		}

		/// <summary>
		/// updates the slide state
		/// expected to be set by a mastering device. currently not secured, but could 
		/// be enhanced to check presenter connection and ignore message or throw error
		/// </summary>
		public void SetCurrentSlide(CurrentSlide currentSlide)
		{
			_presentationState.CurrentSlide = currentSlide;

			// do we continue to broadcast the whole slide object? or do we broadcast 
			// individual pieces for more granularity? E.g. "Audience View" is just listening for "supplementary content" updates
			// do we want to send partial updates?
			Clients.All.notifyCurrentSlide(_presentationState.CurrentSlide);
		}

		/// <summary>
		/// can be requested at any time by any device for a current slide state
		/// expected to be used when a device starts up
		/// </summary>
		public void RequestCurrentSlide()
		{
			// if we haven't yet got a current slide state, we'd better start the presentation
			// MAY REWORK LATER: we might choose to leave this totally blank until the
			// presenter has logged in and "started" the presentation.
			if (_presentationState.CurrentSlide == null)
			{
				// Initialise a started slide: always with indices 1,0,0
				CurrentSlide cs = new CurrentSlide();
				cs.indexh = 1;
				cs.indexv = cs.indexf = 0;
				_presentationState.CurrentSlide = cs;
			}

			// tell anyone who cares what the current slide state is now
			Clients.Caller.notifyCurrentSlide(_presentationState.CurrentSlide);
		}

		/// <summary>
		/// passes through a simple command: "up", "down", etc.
		/// expected to be set by a mastering device. currently not secured, but could 
		/// be enhanced to check presenter connection and ignore message or throw error
		/// </summary>
		public void SendPresentationNavigationCommand(string command)
		{
			Clients.All.receivePresentationNavigationCommand(command);
		}

		#region Polls

		public void AddPollAnswer(PollAnswer pollAnswer)
		{
			try
			{
				// add answer to stash of answers
				_presentationState.AddPollAnswer(pollAnswer);

				Clients.All.debug_RawPollAnswers(_presentationState.PollAnswers);
			}
			catch
			{
				throw new HubException("He slimed me.");
			}
		}
		#endregion
	}
}