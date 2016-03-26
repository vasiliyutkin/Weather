define("util", [
    "vendor",
    "events"
], function (vendor, Events) {
    var _ = vendor._,
        $ = vendor.$;

    var getTimeByOffset = function (ms, offset) {

        var localTime = new Date(ms * 1000);


        return ms ? new Date(localTime.getUTCFullYear(), localTime.getUTCMonth(), localTime.getUTCDate(), (localTime.getUTCHours() + offset), localTime.getUTCMinutes()) : null;
    };
window.getTimeByOffset = getTimeByOffset;
    function formatDate(val) {

        var str = val.toString();


        return (str.length === 1) ? '0' + str : str;
    }

    function convertMoonPhase(phase) {

        var moonPhaseIcon = ["icon-empty-moon", "icon-young-moon", "icon-almost-full", "icon-full-moon", "icon-almost-old", "icon-old-moon"];


        switch (phase) {
            case (phase <= 0.05 ? phase : null):
                return moonPhaseIcon[0];
                break;
            case (phase <= 0.22 ? phase : null):
                return moonPhaseIcon[1];
                break;
            case (phase <= 0.44 ? phase : null):
                return moonPhaseIcon[2];
                break;
            case (phase <= 0.56 ? phase : null):
                return moonPhaseIcon[3];
                break;
            case (phase <= 0.78 ? phase : null):
                return moonPhaseIcon[4];
                break;
            case (phase <= 0.95 ? phase : null):
                return moonPhaseIcon[5];
                break;
            case (phase <= 1 ? phase : null):
                return moonPhaseIcon[0];
                break;
            default:
                return moonPhaseIcon[0];
        }
    }

    function toFahrenheit(val) {
        return (val * 1.8 + 32).toFixed();
    }

    function Timer() {

        if (Timer.instance) {
            return Timer.instance;
        }
        this.start();
        Timer.instance = this;
    }

    _.extend(Timer.prototype, Events, {
        start: function () {
            var self = this;
            this.tick = setInterval(function () {
                self.trigger('tick');
            }, 6000);
        },
        stop: function () {
            clearInterval(this.tick);
        }
    });


    function getSunCoord(sunRadius, currentTime, sunriseTime, sunsetTime) {
        var time = (currentTime - sunriseTime) / (sunsetTime - sunriseTime),
            screenW = $(window).width(),
            screenH = $(window).height(),
            sunHeight = (screenW > screenH) ? screenH / 2 : screenW / 2,
            trajectory = (screenH / 2) + ((Math.pow(screenW / 2)) / (8 * sunHeight)),
            alpha = 2 * Math.acos((trajectory - sunHeight) / trajectory),
            gamma = 2 * Math.asin(sunRadius / (2 * trajectory)),
            phi = this.alpha + 2 * gamma,
            beta = 90 - phi / 2;

    }

    return {
        getTimeByOffset: getTimeByOffset,
        formatDate: formatDate,
        convertMoonPhase: convertMoonPhase,
        toFahrenheit: toFahrenheit,
        Timer: Timer
    }

});