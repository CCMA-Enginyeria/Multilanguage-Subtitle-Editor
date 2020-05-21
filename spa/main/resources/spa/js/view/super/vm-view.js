/**
 * Aquest tipus de vista s'utilitza quan la vista necessita un model de
 * dades complexe o està emparellada amb un o varis models de dades del 
 * servidor. Per a que aquesta vista funcioni correctament s'ha de definir 
 * quin és el viewmodel que contindrà les seves dades a la propietat ViewModel
 * o sobrescriure el mètode getViewModel. 
 * <br/>
 * També es pot definir quin són els events de view-model que la vista ha de gestionar. 
 * Això es fa a l'objecte vmEvents i la seva estructura és la 
 * mateixa que Backbone DOM events ('nom_del_event:propietat': 'funcio_que_es_cridara')
 * <br/>
 * Tots els mètodes que es criden arrel d'un canvi al view-model estan protegits 
 * amb un debounce per evitar molts renders seguits. Però si es vol treure aquesta 
 * protecció, perquè es necessita un canvi inmediat, únicament cal començar el mètode 
 * amb el prefix fast, per exemple "fastRenderName" seria un mètode que es cridaria inmediatament.
 * <br/>
 * L'arquetype és : view/vm-view.js
 * @module view/super/vm-view
 * @requires module:view/super/renderable-view
 * @requires module:view/super/base
 */

define(['./renderable-view', './base'], function(RenderableView, BaseModul) {
    var VMView = RenderableView.extend({
        /*
         * -----------------------------------------------
         * Configuració bàsica
         * -----------------------------------------------
         */
        templateName: null,
        /*
         * -----------------------------------------------
         * Inicialització del mòdul
         * -----------------------------------------------
         */
        initialize: function() {
            BaseModul.prototype.initialize.apply(this, arguments);
            this.props = this.getProps();
            this.viewModel = this.getViewModel();
            this.registerViewModelEvents();
            this.prepareForFirstRender();
            this.render();
        },
        /*
         * -----------------------------------------------
         * Definició d'events del ViewModel amb sintaxis Backbone Model
         * -----------------------------------------------
         */
        vmEvents: {

        },
        /*
         * -----------------------------------------------
         * Funció que serà cridada per adquirir el ViewModel
         * -----------------------------------------------
         */
        getViewModel: function() {
            return new this.ViewModel(null, {
                'model': this.props.model
            });
        },
        /*
         * -----------------------------------------------
         * Funció que serà cridada per passar les dades al template
         * -----------------------------------------------
         */
        getRenderData: function() {
            return this.viewModel.toJSON();
        },
        /*
         * -----------------------------------------------
         * Funció que serà cridada a l'hora de destruir el mòdul
         * -----------------------------------------------
         */
        destroy: function() {
            this.viewModel.stopListening();
            RenderableView.prototype.destroy.apply(this, arguments);
        },
        /*
         * -----------------------------------------------
         * Registre d'events definits a vmEvents
         * -----------------------------------------------
         */
        registerViewModelEvents: function() {
            _.each(this.vmEvents, function(callback, name) {
                var cb = _.debounce(this[callback], 0);
                if (callback.indexOf('fast') === 0) {
                    cb = this[callback];
                }
                this.listenTo(this.viewModel, name, cb);
            }, this);

            if (this.render) {
                this.listenTo(this.viewModel, 'render', _.debounce(this.render, 0));
            }
        }
    });
    return VMView;
});