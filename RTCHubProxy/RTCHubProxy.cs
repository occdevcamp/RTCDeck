using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Client;
using RTCDeckState;

namespace Oxfordcc.DevCamp2013.RTCHubClient
{
    public class RTCHubProxy
    {
        IHubProxy proxy;

        public RTCHubProxy(HubConnection connection)
        {
            proxy = connection.CreateHubProxy(SharedConstants.HUB_NAME);

        }

        public IDisposable OnReceiveCurrentSlide(Action<CurrentSlide> action)
        {
            return proxy.On<CurrentSlide>(SharedConstants.RECEIVE_CURRENT_SLIDE, action);
        }

        public Task<string> SendSlideCommand(string command)
        {
            return proxy.Invoke<string>(SharedConstants.SEND_SLIDE_COMMAND, command);
        }
        public Task RequestCurrentSlide()
        {
            return proxy.Invoke(SharedConstants.REQUEST_CURRENT_SLIDE);
        }
    }
}
