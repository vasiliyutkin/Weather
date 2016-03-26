define("settingsController", [
    "basicEntity",
    "vendor",
    "settingsView",
    "settingsModel"
], function (Entity, vendor, View, settingsModel) {

    var Controller = Entity.Controller,
        _ = vendor._;

    var SettingsController = Controller.extend({
        model: settingsModel,
        initialize: function () {
            this.view = new View;
            this.view.on('change:days', function (val) {
                this.model.set('days', val);
            });
            this.view.on('change:update', function (val) {
                this.model.set('update', val);
            });
            this.view.on('change:units', function (val) {
                this.model.set('units', val);
            })
        }
    });
    return SettingsController;

});