define("pageView", [
    "basicEntity",
    "vendor",
    "text!./app/templates/page.html"
], function (Entity, vendor, page) {

    var View = Entity.View,
        $ = vendor.$,
        _ = vendor._;

    var PageView = View.extend({
        $el: $('#app'),
        template: _.template(page),
        render: function () {
           this.$el.append(this.template);
        },
        initialize: function () {
            this.render();
        }
    });
    return PageView;
});
