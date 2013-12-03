using System;

using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using Microsoft.AspNet.SignalR.Client;
using Android.Views.InputMethods;
using Oxfordcc.DevCamp2013.AndroidDeckUI;
using Android.Webkit;

namespace OxfordCC.DevCamp2013.AndroidDeckUI
{
    [Activity(Label = "Slide Control Application", MainLauncher = true, Icon = "@drawable/icon")]
    public class MainActivity : Activity
    {
        /// <summary>
        /// URL of the Hub server.
        /// </summary>
        private const string HUB_URL = "http://129.67.34.227/RTCDeckServer/signalr";

        /// <summary>
        /// The name of the Hub
        /// </summary>
        private const string HUB_NAME = "RTCDeckHub"; 

        /// <summary>
        /// The name of the method the hub uses to broadcast chat messages
        /// </summary>
        private const string SEND_SLIDE_COMMAND = "SendPresentationNavigationCommand";
        /// <summary>
        /// The name of the method the hub listens for to receive new chat messages
        /// </summary>
        private const string RECEIVE_CURRENT_SLIDE = "notifyCurrentSlide";


        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            SetContentView(Resource.Layout.Main);

            var slideNumberText = FindViewById<TextView>(Resource.Id.slideNumberText);
            var upButton = FindViewById<Button>(Resource.Id.slideUp);
            var downButton = FindViewById<Button>(Resource.Id.slideDown);
            var leftButton = FindViewById<Button>(Resource.Id.slideLeft);
            var rightButton = FindViewById<Button>(Resource.Id.slideRight);
            var speakerNotes = FindViewById<WebView>(Resource.Id.speakerNotes);


            #region Configure the SignalR bindings
            //Create the Hub Proxy connection
            HubConnection connection = new HubConnection(HUB_URL);
            IHubProxy hubProxy = connection.CreateHubProxy(HUB_NAME);

            //Receive slide numbers
            hubProxy.On<int, int>(
                RECEIVE_CURRENT_SLIDE,
                (p1, p2) =>
                {
                    //Need to ensure the changes are in the UI thread, 
                    //since SignalR can fire the events from a different thread
                    RunOnUiThread(() =>
                        slideNumberText.Text = String.Format("Slide {0}/{1}", p1, p2)
                    );
                }
            );

            //Send out slide commands
            BindSlideCommand(hubProxy, upButton, "up");
            BindSlideCommand(hubProxy, downButton, "down");
            BindSlideCommand(hubProxy, leftButton, "left");
            BindSlideCommand(hubProxy, rightButton, "right");

            ////Start the link with the hub
            connection.Start().Wait();
            #endregion

            speakerNotes.LoadData(
@"<html><body>
    <ul>
        <li>Some Excellent Speaker Notes</li>
        <li>Currently static text</li>
    </ul>
</body></html>"
                , "text/html", null);
        }

        void BindSlideCommand(IHubProxy hubProxy, Button button, string command)
        {
            button.Click += (sender, e) =>
            {
                hubProxy.Invoke<String[]>(SEND_SLIDE_COMMAND, command);
            };

        }
    }
}

