using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(RTCDeckServer.Startup))]
namespace RTCDeckServer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
