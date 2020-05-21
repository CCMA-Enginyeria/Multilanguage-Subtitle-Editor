/*globals
    define, ModulJitpub, _, $
*/

/**
 * Vista generica sense view-model (dades), pinta el template que se li indica en el parametre data-template i se li poden pasar dades a través dels data-attributes. 
 * @module view/basic-template
 * @requires module:view/super/renderable-view
 * @example
 * <div class="basic-template-view" data-template="nom-del-template" data-name="name"></div>
 */

define(['./super/renderable-view'], function(RenderableView) {
    ModulJitpub.add({

        /*
         * -----------------------------------------------
         * Configuració bàsica
         * -----------------------------------------------
         */
        name: 'basic-template',
        className: 'basic-template-view',
        KEY_1: 49,

        /*
         * -----------------------------------------------
         * Inicialització del mòdul
         * -----------------------------------------------
         */
        initialize: function() {
            this.templateName = this.$el.data('template');
            this.BaseModul.prototype.initialize.apply(this, arguments);

            //Per debug
            if (window.location.href.indexOf('localhost:8000') > 0) {
                var that = this;
                $(document).keydown(_.bind(function(e) {
                    if (e.which === this.KEY_1 && e.shiftKey) {
                        var isDetached = (that.$el.parents('.prerendering').length === 0 && that.$el.parents('html').length === 0);
                        if (that.templateName && !isDetached) {
                            that.templateName = that.templateName.split('.hbs?')[0] + '.hbs?v=' + Math.random();
                            that.render();
                        }
                    }
                }, this));
            }
        },

        /*
         * -----------------------------------------------
         * Overwrites
         * -----------------------------------------------
         */
        getDebugName: function() {
            return this.name + '\n' + '[' + this.templateName + ']';
        },

        /*
         * -----------------------------------------------
         * Definició d'events amb sintaxis Backbone
         * -----------------------------------------------
         */
        events: {}

        /*
         * -----------------------------------------------
         * Mètodes privats
         * -----------------------------------------------
         */
    }, RenderableView);
});