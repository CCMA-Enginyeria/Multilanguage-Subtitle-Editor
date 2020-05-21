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
        ViewModel: ViewModelClass,
        
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
         * Definició d'events del ViewModel amb sintaxis Backbone Model
         * -----------------------------------------------
         */
        vmEvents: {
            
        },

        /*
         * -----------------------------------------------
         * Mètodes que responen a events de VM
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

    }, VMView);
}(ModulJitpub));