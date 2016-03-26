define([
    "vendor",
    "basicEntity",
    "searchView",
    "searchCollection",
    "citiesCollection",
    "geoService",
    "forecastService"
], function (vendor, Entity, View, searchCollection, citiesCollection, geoService, forecastService) {
    var Controller = Entity.Controller,
        _ = vendor._;

    var SearchController = Controller.extend({
        searchCollection: searchCollection,
        citiesCollection: citiesCollection,
        initialize: function () {
            this.view = new View;
            var self = this;
            this.view.on('inputData', function (data) {
                if (data !== '') {
                    geoService.getCity(data, function (response) {
                        if (response !== null) {
                            self.searchCollection.resetCities(response);
                        } else {
                            self.searchCollection.removeAll();
                        }
                    });
                } else {
                    self.searchCollection.removeAll();
                }
            });
            this.view.on('addCitiesById', this.addCities);
            this.view.on('deleteCities', function(arr) {
                _.each(arr, function(city) {
                    self.citiesCollection.removeByKey('placeId', city.placeId);
                });
            });
        },
        addCities: function (arr) {
            var self = this;
            _.each(arr, function (city) {
                geoService.getCityCoordinates(city.placeId, function (res) {
                    forecastService.getForecast(res[0].geometry.location.lat(), res[0].geometry.location.lng())
                        .then(function (data) {
                            self.citiesCollection.add(_.extend(data, city));
                        });
                });
            });
        }
    });
    return SearchController;
});
