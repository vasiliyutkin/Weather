define("citiesCollection", [
    "searchCollection",
    "vendor",
    "util"
], function (searchCollection, vendor, util) {

    var _ = vendor._,
        formatDate = util.formatDate,
        getTimeByOffset = util.getTimeByOffset,
        convertMoonPhase = util.convertMoonPhase,

        CitiesCollection = searchCollection.constructor.extend({
            localStorage: 'citiesCollection',
            collection: [],
            getFormatedData: function () {
                var ret = [];
                _.each(this.getCities(), function (el) {
                    var city = _.clone(el, true);

                    var updateTime = getTimeByOffset(city.currently.time, city.offset),
                        localTime = new Date()/1000,
                        currentDate = getTimeByOffset(localTime, city.offset),
                        daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

                        item, sunriseTime, sunsetTime, data, i, time, temp;

                    city.updateTime = formatDate(updateTime.getHours()) + ':' + formatDate(updateTime.getMinutes());
                    for (i = 0; i < city.daily.data.length; i++) {
                        item = city.daily.data[i];
                        sunriseTime = getTimeByOffset(item.sunriseTime, city.offset);
                        sunsetTime = getTimeByOffset(item.sunsetTime, city.offset),
                        data = {
                            dayOfWeek: daysArr[getTimeByOffset(item.time, city.offset).getDay()],
                            month: monthArr[currentDate.getMonth()],
                            day: currentDate.getDate(),
                            sunriseTime: formatDate(sunriseTime.getHours()) + ":" + formatDate(sunriseTime.getMinutes()),
                            sunsetTime: formatDate(sunsetTime.getHours()) + ":" + formatDate(sunsetTime.getMinutes()),
                            iconMoon: convertMoonPhase(item.moonPhase),
                            temperatureMax: parseInt(item.temperatureMax).toFixed(),
                            temperatureMin: parseInt(item.temperatureMin).toFixed()
                        };
                        _.extend(item, data);
                    }
                    temp = {
                        humidity: (city.currently.humidity * 100).toFixed(),
                        windSpeed: parseInt(city.currently.windSpeed).toFixed(),
                        temperature: parseInt(city.currently.temperature).toFixed(),
                        summary: city.currently.summary
                    };
                    _.extend(city.currently, city.daily.data[0], temp);

                    for (i = 0; i < 25; i++) {
                        item = city.hourly.data[i];
                        time = getTimeByOffset(item.time, city.offset);
                        item.temperature = parseInt(item.temperature).toFixed();
                        item.time = formatDate(time.getHours()) + ':' + formatDate(time.getMinutes());
                    }
                    //city.hourly.data.splice(23);


                    ret.push(city);
                });

                return ret;
            }
        });
    return new CitiesCollection;
});

