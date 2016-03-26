requirejs.config({
    baseUrl: "js",
    paths: {
        jquery: "libs/jquery-min",
        lodash: "libs/lodash-min",
        flexslider: "libs/jquery.flexslider",
        text: "libs/text",
        rangeSlider: "libs/nouislider",
        perfectScrollbarJQuery: 'libs/perfect-scrollbar.jquery',
        events: "app/utils/events",
        basicEntity: "app/utils/basicEntity",
        vendor: "app/vendor/lib",
        pageView: "app/views/page",
        searchController: "app/controllers/searchController",
        searchView: "app/views/searchView",
        searchCollection: "app/collections/searchCollection",
        citiesCollection: "app/collections/citiesCollection",
        cityModel: "app/models/cityModel",
        geoService: "app/services/geoService",
        forecastService: "app/services/forecastService",
        settingsView: "app/views/settingsView",
        settingsController: "app/controllers/settingsController",
        settingsModel: "app/models/settingsModel",
        util: "app/utils/util",
        storageService: "app/services/storageService",
        dashboardController: "app/controllers/dashboardController",
        dashboardView: "app/views/dashboardView"
    },
    shim: {
        'flexslider': {
            deps: ['jquery']
        },
        'rangeSlider': {
            deps: ["jquery"],
            exports: '$'
        }
    }
});

define("main", [
    "vendor",
    "app/app"
], function (vendor, app) {
    vendor.$(function () {
        app();
    });
});