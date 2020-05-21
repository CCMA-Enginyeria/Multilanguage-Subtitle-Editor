/*global 
    define, Backbone, _, console
 */

/**
 * Model que permet tenir node subModels
 * @module model/super/submodel-model
 */

define([], function() {

    var SubmodelModel = Backbone.Model.extend({
        /*
         * -----------------------------------------------
         * Valors per defecte
         * -----------------------------------------------
         */
        subModels: {},
        parentPrototype: Backbone.Model.prototype,
        FETCH_CACHE_TIME: 1000,

        /*
         * -----------------------------------------------
         * Inicialització
         * -----------------------------------------------
         */
        initialize: function(model, options) {
            this.parentModel = options && options.parentModel;
            this.set(this.parse(model || {}));
        },

        /*
         * -----------------------------------------------
         * Overwrites
         * -----------------------------------------------
         */
        parse: function(data) {
            return this._parseSubModels(data);
        },
        get: function(key) {
            return this._getDeepValue(key);
        },
        toJSON: function() {
            var json = Backbone.Model.prototype.toJSON.apply(this);
            _.each(this.subModels, function(modelName, key) {
                /*jslint unparam:true*/
                try {
                    json[key] = json[key].toJSON();
                } catch (e) {
                    console.error('El submodel ' + key + ' no és vàlid');
                }
            }, this);
            return json;
        },
        fetch: function(method, model, options) {
            /*jslint unparam:true*/
            if (!this.isFetching) {
                this.isFetching = true;
                this.once('sync error', _.bind(function() {
                    this.isFetching = false;
                }, this));
                Backbone.Model.prototype.fetch.apply(this, arguments);
            }
        },

        /*
         * -----------------------------------------------
         * Accions
         * -----------------------------------------------
         */

        /** 
         * Mètode que per forçar reset del model i els submodels
         */
        reset: function() {
            this.clear({
                silent: true
            }).set(this.defaults, {
                silent: true
            });
            this.resetSubmodels();
            this.set(this.parse({}), {
                silent: true
            });
            this.trigger('reset');
        },

        /** 
         * Mètode que per forçar un reset dels submodels
         */
        resetSubmodels: function(submodels) {
            var subModel;
            _.each(submodels || _.keys(this.subModels), _.bind(function(k) {
                subModel = this.get(k);
                if (subModel && subModel.reset) {
                    subModel.reset();
                }
            }, this));
        },

        /*
         * -----------------------------------------------
         * Mètodes privats
         * -----------------------------------------------
         */
        _parseSubModels: function(data) {
            var data = this._initializeSubModels(data);
            this._byPassSubModelEvents(data);
            return data;
        },
        _getDeepValue: function(key) {
            /*jslint unparam:true*/
            return Backbone.Model.prototype.get.apply(this, arguments);
        },
        _initializeSubModels: function(data) {
            _.each(this.subModels, function(SubModel, key) {
                if (!this._isBackboneObject(this.get(key))) {
                    //Creem submodel
                    if (!SubModel) {
                        console.error('Falta submodel: ' + key);
                    } else if (SubModel.prototype.initialize) { //Detectem si és backbone mirant si té initialitze
                        data[key] = new SubModel(data[key], {
                            parentModel: this
                        });
                    } else if (_.isFunction(SubModel)) {
                        data[key] = SubModel(data, {
                            parentModel: this
                        });
                    } else {
                        console.error('El submodel no és vàlid');
                    }
                } else {
                    if (data[key] && !this._isBackboneObject(data[key])) {
                        //Actualitzem del servidor
                        if (this.get(key) instanceof Backbone.Model) {
                            //Transformem l'objecte a submodel amb el mètode parse del submodel
                            var parsedSubmodel = this.get(key).parse(data[key]);
                            this.get(key).set(parsedSubmodel);
                        } else {
                            this.get(key).add(data[key]);
                        }

                    }
                    //Retornem submodel subtituint l'objecte rebut al mètode parse
                    data[key] = this.get(key);
                }
            }, this);
            return data;
        },
        _byPassSubModelEvents: function(data) {
            var eventName;
            _.each(this.subModels, function(SubModel, key) {
                /*jslint unparam:true*/
                if (!data[key]) {
                    return;
                }
                this.stopListening(data[key]);
                this.listenTo(data[key], 'change', function(model) {
                    this._triggerSubModelEvent(key + '.change');
                    if (model) {
                        _.each(model.changed, function(v, k) {
                            this._triggerSubModelEvent(key + '.change:' + k);
                        }, this);
                    }
                });
                this.listenTo(data[key], 'sync', function(model) {
                    this._triggerSubModelEvent(key + '.sync');
                });
                this.listenTo(data[key], 'error', function(model) {
                    this._triggerSubModelEvent(key + '.error');
                });
                this.listenTo(data[key], 'subModelEvent', function(eventName) {
                    this._triggerSubModelEvent(key + '.' + eventName);
                });
            }, this);
        },
        _triggerSubModelEvent: function(eventName) {
            this.trigger(eventName);
            this.trigger('subModelEvent', eventName);
        },
        _isBackboneObject: function(obj) {
            return ((obj instanceof Backbone.Collection) || (obj instanceof Backbone.Model));
        }
    });

    return SubmodelModel;
});