using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RTCDeckState
{
    public class PresentationTimer
    {
        public DateTime StartTime { get; private set; }
        public DateTime? EndTime {get; private set;}
        public TimeSpan TimeElapsed
        {
            get
            {
                return (EndTime ?? DateTime.Now) - StartTime;
            }
        }

        public PresentationTimer(TimeSpan? initialTime = null)
        {
            StartTime = initialTime.HasValue ? DateTime.Now.Add(initialTime.Value.Negate()) : DateTime.Now;
        }
    }
}
