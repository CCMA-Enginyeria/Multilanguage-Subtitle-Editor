/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header} 
 * @see {@link module:view/container} 
 * @see {@link module:view/login-container} 
 * @see {@link module:view/generic-modal-container} 
 */

define(['view-model/spa-app', './super/vm-view'],
    function (SpaAppViewModel, VMView) {
        ModulJitpub.add({

            name: 'spa-app',
            className: 'spa-app-view',
            templateName: 'spa-app',
            ViewModel: SpaAppViewModel,

            initialize: function () {
                this.BaseModul.prototype.initialize.apply(this, arguments);
            },

            afterRender: function () {
                this.BaseModul.prototype.afterRender.apply(this, arguments);
            },

            events: {

            },

            vmEvents: {
                'change': 'render'
            },

        }, VMView);
    });