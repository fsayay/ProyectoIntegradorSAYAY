using System;
using System.Threading;

namespace ApiRestContratos.TimerFeatures
{
    public class TimerManager
    {
        private Timer _timer;
        private AutoResetEvent _autoResetEvent;
        private Action _action;

        public DateTime TimerStarted { get; set; }

        public TimerManager(Action action)
        {
            _action = action;
            _autoResetEvent = new AutoResetEvent(false);
            _timer = new Timer(Execute, _autoResetEvent, TimeSpan.Zero, TimeSpan.FromDays(1));
            TimerStarted = DateTime.Now;
        }

        public void Execute(Object stateInfo)
        {
            _action();
            if((DateTime.Now - TimerStarted).Seconds > 60)
            {
                _timer.Dispose();
            }
        }
    }
}
