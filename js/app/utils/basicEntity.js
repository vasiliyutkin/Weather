define("basicEntity", [
    "events",
    "vendor",
    "storageService"
], function (Events, vendor, storageService) {

    var _ = vendor._;


    var Model =  function (attributes) {
        var attrs = attributes || {},
            storage;
        if (this.localStorage) {
            storage = JSON.parse(storageService.getDataByKey(this.localStorage)) || {};
        }
        this.id = _.uniqueId();
        this.attributes = {};
        attrs = _.extend({}, attrs, this.defaults, storage);
        this.changes = [];
        this.set(attrs);
        this.initialize.apply(this, arguments);
    };
    _.extend(Model.prototype, Events, {
        initialize: function () {},
        get: function (key) {
            return key ? this.attributes[key] : this.attributes;
        },
        set: function (key, val) {
            if (typeof key === 'object') {
                for (var i in key) {
                    if (!_.isEqual(this.attributes[i], key[i])) {
                        this.attributes[i] = key[i];
                        this.changes.push(key[i]);
                    }
                }
            } else {
                if (_.has(this.attributes, key) && this.attributes[key] !== val) {
                    this.attributes[key] = val;
                    this.changes.push(key);
                }
            }

            if (this.changes.length) {
                _.each(this.changes, function (el, index, list) {
                    this.trigger('change:' + el);
                }, this);
                this.trigger('change');
                this.changes.length = 0;
            }
            if (this.localStorage) {
                storageService.saveData(this.localStorage, this.attributes);
            }
        },
        clear: function () {
            for (var key in this.attributes) {
                delete this.attributes[key];
            }
            this.trigger('clear');
            if (this.localStorage) {
                storageService.remove(this.localStorage);
            }
        }
    });

    var Collection = function () {
        var storage;
        if (this.localStorage) {
            storage = JSON.parse(storageService.getDataByKey(this.localStorage)) || [];
        }
        this.collection = storage || [];
        this.initialize.apply(this, arguments);
    };

    _.extend(Collection.prototype, Events, {
        initialize: function () {},
        add: function (obj) {
            var self,
                model;
            if (!_.isArray(obj)) {
                model = new this.model(obj);
                this.collection.push(model);
                this.trigger('add', model.get());
            } else {
                self = this;
                _.each(obj, function (obj) {
                    var model = new self.model(obj);

                    self.collection.push(model);
                    self.trigger('add', model.get());
                });
            }
            if (this.localStorage) {
                storageService.saveData(this.localStorage, this.collection);
            }
        },
        removeByKey: function (key, val) {
            var el;
            for (var i = 0; i < this.collection.length; i++) {
                    if (this.collection[i].attributes[key] === val) {
                        el = _.clone(this.collection[i].attributes);
                        this.collection.splice(i, 1);
                        if (this.localStorage) {
                            storageService.saveData(this.localStorage, this.collection);
                        }
                        this.trigger('remove', el);
                        return;
                    }

            }
        },
        removeAll: function () {
            this.collection.length = 0;
            if (this.localStorage) {
                storageService.remove(this.localStorage);
            }
            this.trigger('clear');
        }
    });


    var Controller = function (attr) {
        _.extend(this, attr);
        this.initialize.apply(this, arguments);
    };

    _.extend(Controller.prototype, Events, {
        initialize: function () {}
    });


    var View = function (attr) {
        _.extend(this, attr);
        this.initialize.apply(this, arguments);
    };

    _.extend(View.prototype, Events, {
        initialize: function () {}
    });

    var extend = function(protoProps) {
        var parent = this,
            child,
            Surrogate;

        child = function () {
            return parent.apply(this, arguments);
        };
        _.extend(child, parent);

        Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }

        child.__super__ = parent.prototype;

        return child;

    };

    Model.extend = Collection.extend = Controller.extend = View.extend = extend;
    return {
        Model: Model,
        Collection: Collection,
        Controller: Controller,
        View: View
    };
});
