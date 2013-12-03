using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using RTCDeckServer.Models;

namespace RTCDeckServer.Hubs
{
	[HubName("RTCDeckHub")]
	public class RTCDeckHub : Hub
	{
		private readonly PresentationState _presentationState;

		public RTCDeckHub() : this(PresentationState.Instance) { }
		public RTCDeckHub(PresentationState presentationState)
		{
			_presentationState = presentationState;
		}

		public void SetCurrentSlide(int part1, int part2)
		{
			_presentationState.UpdateCurrentSlide(part1, part2);
			Clients.All.notifyCurrentSlide(part1, part2);
		}
		
		public void RequestCurrentSlide()
		{
			int[] CurrentSlide = _presentationState.GetCurrentSlide();
			Clients.Caller.notifyCurrentSlide(CurrentSlide[0], CurrentSlide[1]);
		}

		public void SendPresentationNavigationCommand(string command)
		{
			Clients.All.receivePresentationNavigationCommand(command);
		}
	}
}