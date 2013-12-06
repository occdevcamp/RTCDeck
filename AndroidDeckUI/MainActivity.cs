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
using Android.Content.PM;
using Android.Util;
using Oxfordcc.DevCamp2013.RTCHubClient;

namespace OxfordCC.DevCamp2013.AndroidDeckUI
{
    [Activity(Label = "Slide Control Application", MainLauncher = true, Icon = "@drawable/icon", ScreenOrientation = ScreenOrientation.Portrait, ConfigurationChanges=Android.Content.PM.ConfigChanges.Orientation)]
    public class MainActivity : Activity
    {
        /// <summary>
        /// URL of the Hub server.
        /// </summary>
        private const string HUB_URL = "http://129.67.33.245/RTCDeckServer/signalr";

        RTCHubProxy hubProxy;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            SetContentView(Resource.Layout.Main);

            #region Get the Controls from the Layout
            var slideNumberText = FindViewById<TextView>(Resource.Id.slideNumberText);
            var upButton = FindViewById<Button>(Resource.Id.slideUp);
            var downButton = FindViewById<Button>(Resource.Id.slideDown);
            var leftButton = FindViewById<Button>(Resource.Id.slideLeft);
            var rightButton = FindViewById<Button>(Resource.Id.slideRight);
            var speakerNotes = FindViewById<WebView>(Resource.Id.speakerNotes);
            #endregion

            #region Configure the SignalR bindings
            //Create the Hub Proxy connection
            Log.Warn("AndroidDeckUI", String.Format("Creating Hub Connection to {0}", HUB_URL));
            HubConnection connection = new HubConnection(HUB_URL);
            hubProxy = new RTCHubProxy(connection);
            Log.Warn("AndroidDeckUI", String.Format("Created Hub Connection to {0}", HUB_URL));

            //Receive slide numbers
            hubProxy.OnReceiveCurrentSlide(
                currentSlide =>
                {
                    Log.Warn("AndroidDeckUI", String.Format("Received slide: {0}/{1}:{2}", currentSlide.indexf, currentSlide.indexh, currentSlide.indexv));
                    //Need to ensure the changes are in the UI thread, 
                    //since SignalR can fire the events from a different thread
                    RunOnUiThread(() =>
                    {
                        slideNumberText.Text = String.Format("Slide {0}/{1}:{2}", currentSlide.indexh, currentSlide.indexv, currentSlide.indexf);
                        speakerNotes.LoadData(String.Format("<html><head><style>body {{ font-size: 1.2em; }}</style></head><body>{0}</body></html>",currentSlide.speakerNotes), "text/html", null);
                        Log.Warn("AndroidDeckUI", String.Format("Processed slide: {0}/{1}:{2}", currentSlide.indexf, currentSlide.indexh, currentSlide.indexv));
                    });
                }
            );

            //Send out slide commands
            BindSlideCommand(hubProxy, upButton, "up");
            BindSlideCommand(hubProxy, downButton, "down");
            BindSlideCommand(hubProxy, leftButton, "left");
            BindSlideCommand(hubProxy, rightButton, "right");

            //Start the link with the hub
            //Need to wait for this so that none of the events happen before we're ready
            connection.Start().Wait();

            //Get the current details
            hubProxy.RequestCurrentSlide();
            #endregion

        }

        void BindSlideCommand(RTCHubProxy hubProxy, Button button, string command)
        {
            button.Click += (sender, e) =>
            {
                Log.Warn("AndroidDeckUI", String.Format("Invoking command: {0}", command));
                hubProxy.SendSlideCommand(command);
            };

        }
    }
}

