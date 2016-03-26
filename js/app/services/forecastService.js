define("forecastService", [
    "vendor"
], function(vendor) {
    "use strict";

    var $ = vendor.$;

    var API_KEY = "fe0695cb99e5ef84fbb7b4a7a8600f62";
    window.getForecast = function(lat, lng) {
        return $.getJSON(['https://api.forecast.io/forecast', API_KEY, [lat, lng].join(), '?callback=?'].join('/'));
    };
    return {
        getForecast: function(lat, lng) {
            return $.getJSON(['https://api.forecast.io/forecast', API_KEY, [lat, lng].join(), '?units=si&callback=?'].join('/'));
        }
    };
});
