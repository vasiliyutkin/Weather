define("dashboardView", [
    "vendor",
    "basicEntity",
    "text!./app/templates/dashboardTmpl.html",
    "citiesCollection",
    "settingsModel",
    "util"
], function (vendor, Entity, dashboardTmpl, citiesCollection, settingsModel, util) {

    var $ = vendor.$,
        _ = vendor._,
        View = Entity.View;
    window.settingsM = settingsModel;

    var DashboardView = View.extend({
        citiesCollection: citiesCollection,
        settingsModel: settingsModel,
        template: _.template(dashboardTmpl),
        initialize: function () {
            this.$el = $('#dashboard');
            this.render();
            this.attachEvent();
        },
        attachEvent: function () {
            var self = this;
            this.citiesCollection.on('remove', this.removeSlide, this);
            this.citiesCollection.on('clear', this.clearSlider, this);
            this.citiesCollection.on('add', this.addSlide, this);
            this.settingsModel.on('change:days change:units', this.renderSlider, this);

            this.$el.on('click', '.icon-refresh', function () {
                self.trigger('refresh');
            })
        },
        render: function () {
            var $docFragment = $(document.createDocumentFragment());
            var self = this;
            self.$el.find('.slides').html('');
            _.each(this.citiesCollection.getFormatedData(), function (city) {
                $docFragment.append(self.template({
                    itemCity: city,
                    settings: self.settingsModel.attributes,
                    toFahrenheit: util.toFahrenheit
                }));
            });
            self.$el.find('.slides').html($docFragment);
            this.initPlugins();
        },
        addSlide: function (city) {
            var self = this;
            if (this.$el.data('flexslider')) {
                city = this.citiesCollection.getFormatedData();
                this.$el.data('flexslider').addSlide(self.template({
                    itemCity: city[city.length - 1],
                    settings: self.settingsModel.attributes,
                    toFahrenheit: util.toFahrenheit
                }));
                $(".weather-today-slider").perfectScrollbar({
                    wheelPropagation: true,
                    wheelSpeed: 1
                });

            } else {
                this.render();
                this.$el.data('flexslider').setup();
            }
            this.$el.flexslider(0);
        },
        removeSlide: function (data) {
            this.$el.data('flexslider').removeSlide($('#' + data.placeId));
            this.$el.flexslider(0);
        },
        renderSlider: function () {
            this.render();
            if (this.$el.data('flexslider')) {
                this.$el.data('flexslider').setup();
            }
        },
        clearSlider: function () {
            while (this.$el.data('flexslider').count !== 0) {
                this.$el.data('flexslider').removeSlide($('.item-slide'));
            }
        },
        initPlugins: function () {
            var self = this,
                city;
            self.$el.flexslider({
                animation: "slide",
                directionNav: false,
                slideshow: false,
                added: function (slider) {
                    slider.index(0);
                    slider.setup();
                },
                after: function (e) {
                    city = self.citiesCollection.getCities();
                    self.setSeason(city[e.currentSlide]);
                    $(".weather-today-slider").perfectScrollbar('update');
                },
                init: function () {
                    city = self.citiesCollection.getCities();
                    self.setSeason(city[0]);
                    $(".weather-today-slider").perfectScrollbar({});
                }
            });
        },
        setSeason: function (city) {
            if (city) {
                var localTime = new Date().getTime() / 1000,
                    sunRise = util.getTimeByOffset(city.daily.data[0].sunriseTime, city.offset).getHours(),
                    sunSet = util.getTimeByOffset(city.daily.data[0].sunsetTime, city.offset).getHours(),
                    cityTime = util.getTimeByOffset(localTime, city.offset).getHours(),
                    dayPart = ['morning', 'day', 'evening', 'night'],
                    temperature = ["cold", "hot"],
                    index;

                /*set season*/

                $('#app').removeClass(temperature.join(" "));
                if (city.currently.temperature < 20) {
                    $('#app').addClass(temperature[0]);
                } else {
                    $('#app').addClass(temperature[1]);
                }

                /*set time of day*/

                switch (cityTime) {
                    case ((cityTime <= sunRise) ? cityTime : null):
                        index = 3;
                        break;
                    case ((cityTime <= sunRise + 3) ? cityTime : null):
                        index = 0;
                        break;
                    case ((cityTime <= sunSet - 3) ? cityTime : null):
                        index = 1;
                        break;
                    case ((cityTime <= sunSet + 3) ? cityTime : null):
                        index = 2;
                        break;
                    case ((cityTime <= 24) ? cityTime : null):
                        index = 3;
                        break;
                }
                $('#app').removeClass(dayPart.join(" ")).addClass(dayPart[index]);
            }
        }
    });

    return DashboardView;
});