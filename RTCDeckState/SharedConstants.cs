using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RTCDeckState
{
	public static class SharedConstants
	{
		#region Hub Constants
		/// <summary>
        /// The name of the Hub
        /// </summary>
        public const string HUB_NAME = "RTCDeckHub"; 

        /// <summary>
        /// The name of the method the hub uses to broadcast chat messages
        /// </summary>
		public const string SEND_SLIDE_COMMAND = "SendPresentationNavigationCommand";
        
		/// <summary>
        /// The name of the method the hub listens for to receive new chat messages
        /// </summary>
		public const string RECEIVE_CURRENT_SLIDE = "notifyCurrentSlide";

		public const string REQUEST_CURRENT_SLIDE = "RequestCurrentSlide";
		public const string NOTIFY_CURRENT_SLIDE = "notifyCurrentSlide";
	}

		#endregion
}
