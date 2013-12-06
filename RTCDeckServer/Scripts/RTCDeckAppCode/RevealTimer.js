
function startTimer(secondsElapsed){
    var start = new Date();
    if (secondsElapsed){
        start.setSeconds(start.getSeconds() - secondsElapsed);
    }
    
    var timeEl = document.querySelector('.time'),
        clockEl = document.getElementById('clock'),
        hoursEl = document.getElementById('hours'),
        minutesEl = document.getElementById('minutes'),
        secondsEl = document.getElementById('seconds');

    setInterval(function () {

        timeEl.style.opacity = 1;

        var diff, hours, minutes, seconds,
            now = new Date();

        diff = now.getTime() - start.getTime();
        hours = Math.floor(diff / (1000 * 60 * 60));
        minutes = Math.floor((diff / (1000 * 60)) % 60);
        seconds = Math.floor((diff / 1000) % 60);

        clockEl.innerHTML = now.toLocaleTimeString();
        hoursEl.innerHTML = zeroPadInteger(hours);
        hoursEl.className = hours > 0 ? "" : "mute";
        minutesEl.innerHTML = ":" + zeroPadInteger(minutes);
        minutesEl.className = minutes > 0 ? "" : "mute";
        secondsEl.innerHTML = ":" + zeroPadInteger(seconds);

    }, 1000);
}

function zeroPadInteger(num) {
    var str = "00" + parseInt(num);
    return str.substring(str.length - 2);
}