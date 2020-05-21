define([], function() {
    return {
        initialize: function(View) {
            this.view = new View();
            this._disableSubviewsRender();
            return this.view;
        },

        _disableSubviewsRender: function() {
            this.view.initSubviewsForNewEl = function(el, callback) {
                callback();
            };
        }


    };
});