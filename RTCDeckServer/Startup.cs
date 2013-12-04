using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartupAttribute(typeof(RTCDeckServer.Startup))]
namespace RTCDeckServer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            var hubConfiguration = new HubConfiguration();
#if DEBUG
            hubConfiguration.EnableDetailedErrors = true;
#endif
            app.MapSignalR(hubConfiguration);

        }
    }
}
