define("settingsView", [
    "basicEntity",
    "vendor",
    "text!./app/templates/settingsTmpl.html",
    "settingsModel",
    "util",
    "rangeSlider"
], function (Entity, vendor, settingsTemplate, settingsModel, util, noUISlider) {

    var View = Entity.View,
        $ = vendor.$,
        _ = vendor._;


    var SettingsView = View.extend({
        model: settingsModel,
        template: settingsTemplate,
        render: function () {
            var days = this.model.get('days'),
                update = this.model.get('update');
            this.ranges.$weatherForVal.html(days);
            this.ranges.$updateEveryVal.html(update);
            this.ranges.weatherFor.set(days);
            this.ranges.updateEvery.set(update);
        },
        ranges: {
            weatherFor: null,
            updateEvery: null
        },
        initialize: function () {
            this.$el = $('#sidebar');
            var self = this;
            this.$el.append(_.template(this.template, this.model.attributes));
            this.ranges.weatherFor = noUISlider.create(this.$el.find('#weather-for .range')[0], {
                start: self.model.get('days'),
                snap: true,
                connect: 'lower',
                range: {
                    'min': 1,
                    '14.28%': 1,
                    '28.58%': 2,
                    '42.84%': 3,
                    '57.12%': 4,
                    '71.4%': 5,
                    '85.68': 6,
                    'max': 7
                }
            });
            this.ranges.updateEvery = noUISlider.create(this.$el.find('#update-every .range')[0], {
                start: self.model.get('update'),
                snap: true,
                connect: 'lower',
                range: {
                    'min': 15,
                    '50%': 30,
                    '75%': 45,
                    'max': 60
                }
            });

            this.ranges.$weatherForVal = this.$el.find('#weather-for .range-val');
            this.ranges.$updateEveryVal = this.$el.find('#update-every .range-val');

            this.model.on('change', this.render, this);

            this.attachEvents();
        },
        attachEvents: function () {
            var self = this;
            this.ranges.weatherFor.on('change', function () {
                self.trigger('change:days', parseInt(this.get()));
            });
            this.ranges.updateEvery.on('change', function () {
                self.trigger('change:update', parseInt(this.get()));
            });
            this.$el.find('#units').change(function (e) {
                self.trigger('change:units', e.target.getAttribute('data-units'));
            });
        }
    });
    return SettingsView;
});
