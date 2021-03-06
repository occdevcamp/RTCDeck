﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
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
        /// Reset the presentation state to the default
        /// </summary>
        public void ResetPresentation()
        {
            PresentationState.Reset();
        }

		/// <summary>
		/// updates the slide state
		/// expected to be set by a mastering device. currently not secured, but could 
		/// be enhanced to check presenter connection and ignore message or throw error
		/// </summary>
		public void SetCurrentSlide(CurrentSlide currentSlide)
		{
			Debug.WriteLine(String.Format("Received Current Slide Request: {0}/{1}:{2}", currentSlide.indexf, currentSlide.indexh, currentSlide.indexv));
			
			// has the slide changed (h or v index)? from point of view of polling really
			bool slideHasChanged = (currentSlide.indexh != _presentationState.CurrentSlide.indexh || currentSlide.indexv != _presentationState.CurrentSlide.indexv);

			_presentationState.CurrentSlide = currentSlide;


			// do we continue to broadcast the whole slide object? or do we broadcast 
			// individual pieces for more granularity? E.g. "Audience View" is just listening for "supplementary content" updates
			// do we want to send partial updates?
			Debug.WriteLine(String.Format("Notifying Current Slide to All: {0}/{1}:{2}", _presentationState.CurrentSlide.indexf, _presentationState.CurrentSlide.indexh, _presentationState.CurrentSlide.indexv));
			Clients.Others.notifyCurrentSlide(_presentationState.CurrentSlide);

            var polls = currentSlide.polls.Select(poll => _presentationState.Polls[poll.Identifier]).ToList();

			// a bit bodgy, but this tells the "polls" part of the presenter that they've changed the slide 
			// but without issuing a "notifyCurrentSlide".
			if (slideHasChanged)
				Clients.Caller.presenterClearPollGraphs();

            Clients.Caller.notifyPollData(currentSlide, polls);
		}

		/// <summary>
		/// can be requested at any time by any device for a current slide state
		/// expected to be used when a device starts up
		/// </summary>
		public void RequestCurrentSlide()
		{
			Debug.WriteLine(String.Format("Received Request for Current Slide"));
			// if we haven't yet got a current slide state, we'd better start the presentation
			// MAY REWORK LATER: we might choose to leave this totally blank until the
			// presenter has logged in and "started" the presentation.
			if (_presentationState.CurrentSlide == null)
			{
				// Initialise a started slide: always with indices 0,0,0
				CurrentSlide cs = new CurrentSlide();
				cs.indexh = cs.indexv = cs.indexf = -1;
				cs.speakerNotes = "The presentation has not yet started. Please hold. Your call is very important to us.";
				cs.supplementaryContent = "The presentation has not yet started. Please hold. Your call is very important to us.";
				_presentationState.CurrentSlide = cs;
			}

			// tell anyone who cares what the current slide state is now
			Debug.WriteLine(String.Format("Notifying Current Slide to Caller: {0}/{1}:{2}", _presentationState.CurrentSlide.indexf, _presentationState.CurrentSlide.indexh, _presentationState.CurrentSlide.indexv));
			Clients.Caller.notifyCurrentSlide(_presentationState.CurrentSlide);
		}

		/// <summary>
		/// passes through a simple command: "up", "down", etc.
		/// expected to be set by a mastering device. currently not secured, but could 
		/// be enhanced to check presenter connection and ignore message or throw error
		/// </summary>
		public void SendPresentationNavigationCommand(string command)
		{
			Debug.WriteLine(String.Format("Received Presentation Navigation Command: {0}", command));

			Debug.WriteLine(String.Format("Transmitting Presentation Navigation Command to All: {0}", command));
			Clients.Others.receivePresentationNavigationCommand(command);
		}

        #region Presentation metadata

        public void StartPresentationTimer()
        {
            Clients.Others.notifyTimerStarted();
            _presentationState.StartTimer();
        }

        public void RequestPresentationTimeElapsed()
        {
            TimeSpan TimeElapsed;
            if (_presentationState.Timer == null)
            {
                TimeElapsed = new TimeSpan(0);
            }
            else
            {
                TimeElapsed = _presentationState.Timer.TimeElapsed;
            }
            Clients.Caller.notifyTimeElapsed(TimeElapsed.TotalSeconds);
        }

        #endregion

        #region Polls


		public void AddPollAnswer(PollAnswer pollAnswer)
		{
			try
			{
				// dress the PollAnswer with the user's connection id
				// (I think this could be done in the client app if we wanted, 
				// but not exploring that now)
				pollAnswer.ConnectionId = Context.ConnectionId;

				// add answer to stash of answers
				_presentationState.AddPollAnswer(pollAnswer);

				// send raw data to "all" initally for debug
				Clients.All.debug_RawPollAnswers(_presentationState.PollAnswers);

				// send poll back (?to presenters ultimately) with answers
				Clients.All.updatePollAnswers(pollAnswer.PollIdentifier, _presentationState.Polls[pollAnswer.PollIdentifier]);
			}
			catch
			{
				throw new HubException("He slimed me.");
			}
		}

		/// <summary>
		/// Ask for the current set of results for a poll.
		/// </summary>
		/// <param name="pollIdentifier"></param>
		public void RequestPollAnswers(string pollIdentifier)
		{
			// send poll back (?to presenters ultimately) with answers
			if (_presentationState.Polls.ContainsKey(pollIdentifier))
				Clients.All.updatePollAnswers(pollIdentifier, _presentationState.Polls[pollIdentifier]);
            else
            {
                //Store the fact we were interested for later broadcast to this client
                _presentationState.StoreUnansweredPollAnswerRequest(pollIdentifier, this.Context.ConnectionId);
            }
		}

		#endregion

        #region Annotate

        /// <summary>
        /// Passes the drawing event to other clients.
        /// Co-ordinates are scaled for a 1024x768 canvas, as used by reveal for slides.
        /// </summary>
        /// <param name="drawObject"></param>
        public void SendDraw(string drawObject)
        {
            Clients.Others.receiveDrawing(drawObject);
        }

        #endregion
    }
}