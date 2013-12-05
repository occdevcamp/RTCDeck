using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RTCDeckServer.Controllers
{
	public class PresentationHubController : Controller
    {
        //
        // GET: /Audience/
        public ActionResult Index()
        {
            return View();
        }
	}
}