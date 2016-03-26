define("settingsModel", [
    "basicEntity"
], function (Entity) {

    var Model = Entity.Model;


    var SettingsModel = Model.extend({
        defaults: {
            units: 'F',
            update: 30,
            days: 7
        },
        localStorage: 'settings'
    });
    return new SettingsModel;
});
