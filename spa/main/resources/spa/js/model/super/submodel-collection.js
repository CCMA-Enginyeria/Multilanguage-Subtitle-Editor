/*global 
    define, Backbone, _
 */

/**
 * Collection de models que pot ser submodel
 * @module model/super/submodel-collection
 */

define([], function() {

    var SubmodelCollection = Backbone.Collection.extend({
        /*
         * -----------------------------------------------
         * Valors per defecte
         * -----------------------------------------------
         */
        subModels: {},
        parentPrototype: Backbone.Collection.prototype,

        /*
         * -----------------------------------------------
         * Inicialització
         * -----------------------------------------------
         */
        initialize: function(model, options) {
            this.parentModel = options && options.parentModel;
            this.set(this.parse(model || []));
        },

        /*
         * -----------------------------------------------
         * Overwrites
         * -----------------------------------------------
         */

        fetch: function(method, model, options) {
            /*jslint unparam:true*/
            if (!this.isFetching) {
                this.isFetching = true;
                this.once('sync error', _.bind(function() {
                    this.isFetching = false;
                }, this));
                Backbone.Collection.prototype.fetch.apply(this, arguments);
            }
        }

    });

    return SubmodelCollection;
});