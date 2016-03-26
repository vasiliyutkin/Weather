define([
    "pageView",
    "settingsController",
    "searchController",
    "dashboardController"
], function (Page, Settings, Search, Dashboard) {
    return function () {
        new Page;
        new Settings;
        new Search;
        new Dashboard;
    };
});
