using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RTCDeckServer.Models
{
    /// <summary>
    /// Model representing a view of the presentation
    /// </summary>
    public class PresentationModel
    {
        public bool IsPrimaryPresentation { get; set; }
        public PresentationModel(bool isPrimaryPresentation)
        {
            IsPrimaryPresentation = isPrimaryPresentation;
        }
    }
}