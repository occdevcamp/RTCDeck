using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using RTCDeckServer.Hubs;

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

		private int[] CurrentSlide { get; set; }

		public void UpdateCurrentSlide(int part1, int part2)
		{
			if (CurrentSlide == null)
				CurrentSlide = new int[] { 1, 0 };
			else
				CurrentSlide = new int[] { part1, part2 };
		}

		public int[] GetCurrentSlide()
		{
			if (CurrentSlide == null)
				CurrentSlide = new int[] { 1, 0 };

			return CurrentSlide;
		}

	}
}