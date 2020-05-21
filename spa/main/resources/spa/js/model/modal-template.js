/**
 * @module model/digition-app
 */

define([], function () {
    var instance = null;
    var ModalTemplateModel = Backbone.Model.extend({

        defaults: {

        },

    }, {
        getInstance: function () {
            instance = instance ? instance : new ModalTemplateModel();
            return instance;
        },
        destroyInstance: function () {
            instance = null;
        }
    });

    return ModalTemplateModel;
});