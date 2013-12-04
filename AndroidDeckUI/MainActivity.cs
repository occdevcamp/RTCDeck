﻿using System;

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
using RTCDeckState;
using Android.Content.PM;

namespace OxfordCC.DevCamp2013.AndroidDeckUI
{
    [Activity(Label = "Slide Control Application", MainLauncher = true, Icon = "@drawable/icon", ScreenOrientation = ScreenOrientation.Portrait, ConfigurationChanges=Android.Content.PM.ConfigChanges.Orientation)]
    public class MainActivity : Activity
    {
        /// <summary>
        /// URL of the Hub server.
        /// </summary>
        private const string HUB_URL = "http://129.67.34.159/RTCDeckServer/signalr";

        IHubProxy hubProxy;

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
            HubConnection connection = new HubConnection(HUB_URL);
            hubProxy = connection.CreateHubProxy(SharedConstants.HUB_NAME);

            //Receive slide numbers
            hubProxy.On<CurrentSlide>(
                SharedConstants.RECEIVE_CURRENT_SLIDE,
                (currentSlide) =>
                {
                    //Need to ensure the changes are in the UI thread, 
                    //since SignalR can fire the events from a different thread
                    RunOnUiThread(() =>
                    {
                        slideNumberText.Text = String.Format("Slide {0}/{1}:{2}", currentSlide.indexh, currentSlide.indexv, currentSlide.indexf);
                        speakerNotes.LoadData(String.Format("<html><body>{0}</body></html>",currentSlide.speakerNotes), "text/html", null);
                    });
                }
            );

            //Send out slide commands
            BindSlideCommand(hubProxy, upButton, "up");
            BindSlideCommand(hubProxy, downButton, "down");
            BindSlideCommand(hubProxy, leftButton, "left");
            BindSlideCommand(hubProxy, rightButton, "right");

            ////Start the link with the hub
            connection.Start().Wait();
            hubProxy.Invoke(SharedConstants.REQUEST_CURRENT_SLIDE);
            #endregion

        }

        void BindSlideCommand(IHubProxy hubProxy, Button button, string command)
        {
            button.Click += (sender, e) =>
            {
                hubProxy.Invoke<String[]>(SharedConstants.SEND_SLIDE_COMMAND, command);
            };

        }
    }
}

