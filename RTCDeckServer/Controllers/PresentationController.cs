using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RTCDeckServer.Models;

namespace RTCDeckServer.Controllers
{
    public class PresentationController : Controller
    {

        public ActionResult Index()
        {
            return View(new PresentationModel(false));
        }
        public ActionResult Secondary()
        {
            return View("Secondary");
        }
        public ActionResult Presenter()
        {
            return View("Index",new PresentationModel(true));
        }
	}
}