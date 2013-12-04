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
	}
}