define([
    "vendor"
], function (vendor) {
    "use strict";

    var _ = vendor._;

    return {
        saveData: function (key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        },
        getData: function () {
            var ret = {};

            _(localStorage).each(function (item, index) {
                ret[localStorage.key(index)] = localStorage.getItem(localStorage.key(index));
            });

            return ret;
        },
        getDataByKey: function (key) {
            return localStorage.getItem(key);
        },
        remove: function (name) {
                localStorage.removeItem(name);
        }
    };

});
