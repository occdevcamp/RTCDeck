using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace RTCDeckServer.Hubs
{
    public class RTCDeckHub : Hub
    {
        public void SetCurrentSlide(int indexh, int indexv)
        {
            Clients.All.receiveCurrentSlideIndex(new { h = indexh, v = indexv });
        }
    }

}