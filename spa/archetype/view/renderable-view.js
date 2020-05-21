(function (ModulJitpub) {
    ModulJitpub.add({

        /*
         * -----------------------------------------------
         * Configuració bàsica
         * -----------------------------------------------
         */
        name: 'name',
        className: 'name-view',
        templateName: 'name',

        /*
         * -----------------------------------------------
         * Inicialització del mòdul
         * -----------------------------------------------
         */
        initialize: function () {
            this.BaseModul.prototype.initialize.apply(this, arguments);
        },

        /*
         * -----------------------------------------------
         * Overwrites
         * -----------------------------------------------
         */

        /*
         * -----------------------------------------------
         * Definició d'events amb sintaxis Backbone
         * -----------------------------------------------
         */
        events: {

        },

        /*
         * -----------------------------------------------
         * Mètodes que responen a events de UI
         * -----------------------------------------------
         */

        /*
         * -----------------------------------------------
         * Mètodes privats
         * -----------------------------------------------
         */

    }, RenderableView);
}(ModulJitpub));