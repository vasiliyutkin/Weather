define("dashboardController", [
    "vendor",
    "basicEntity",
    "citiesCollection",
    "settingsModel",
    "dashboardView",
    "searchController",
    "util"

], function (vendor, Entity, citiesCollection, settingsModel, DashboardView, searchController, util) {

    var $ = vendor.$,
        _ = vendor._,
        Controller = Entity.Controller;

    var DashboardController = searchController.extend({
        citiesCollection: citiesCollection,
        settingsModel: settingsModel,
        clock: new util.Timer(),
        initialize: function () {
            this.view = new DashboardView;
            this.view.on('refresh', this.update, this);
            this.clock.on('tick', this.checkTime, this);
        },
        update: function () {
            var arr = [];
            _.each(this.citiesCollection.getCities(), function (item) {
                arr.push(_.pick(item, 'placeId', 'city'));
            });
            this.citiesCollection.removeAll();
            this.addCities(arr);
        },
        checkTime: function () {
            if (this.citiesCollection.collection.length) {
                var localTime = new Date(),
                    cityTime = new Date(this.citiesCollection.getCities()[0].currently.time * 1000 + (this.settingsModel.get().update * 60000));
                if (localTime >= cityTime) {
                    this.update();
                }
            }
        }
    });
    return DashboardController;

});
