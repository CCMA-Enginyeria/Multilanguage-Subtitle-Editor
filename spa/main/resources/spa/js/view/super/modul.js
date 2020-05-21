/*globals
   Backbone, BaseModul, Plugins, $, _
*/

/*jslint nomen: true*/
(function(expots, $, _, Backbone) {
    /*jslint unparam: true*/
    var ModulsConstructors = {},
        ModulsInstances = [],
        MaxCalculationTime = 15;
    expots.ModulJitpub = {
        initialize: function() {
            this.cleanDettachedModuls = _.debounce(this.cleanDettachedModuls, 100);
            this.registerListeners();
            this.refreshAll();
        },
        registerListeners: function() {
            var that = this;
            $(document).on('RefrescaModul', function(e, name) {
                if (name === '*') {
                    that.refreshAll();
                } else if (_.has(ModulsConstructors, name) === true) {
                    that.refresh(ModulsConstructors[name], $(document));
                } else {
                    throw 'El modul que es vol refrescar no existeix';
                }
                that.cleanDettachedModuls();
            });
            $(document).on('RefrescaNode', function(e, node) {
                if ($(node).length === 0) {
                    throw 'El node indicat no existeix a la plana';
                }
                that.refreshFromNode($(node), e.options);
                that.cleanDettachedModuls();
            });
            $(document).on('RefrescaModulNode', function(e, obj) {
                if (_.has(ModulsConstructors, obj.modul) === true && obj.node.length > 0) {
                    that.refresh(ModulsConstructors[obj.modul], obj.node);
                }

                that.cleanDettachedModuls();
            });
        },
        add: function(ModulPrototype, SuperModul) {
            var name, Modul;
            if (_.has(ModulPrototype, 'name') === false) {
                throw 'La classe no conté nom';
            }
            name = ModulPrototype.name;
            if (_.has(ModulsConstructors, name) === true) {
                throw 'S\'està important més d\'una vegada la classe ' + name;
            }
            SuperModul = SuperModul || BaseModul;
            ModulPrototype.BaseModul = SuperModul;
            Modul = SuperModul.extend(ModulPrototype);
            ModulsConstructors[name] = Modul;
            return Modul;
        },
        get: function(name) {
            if (_.has(ModulsConstructors, name) === false) {
                throw 'El mòdul ' + name + ' no està registrat';
            }
            return ModulsConstructors[name];
        },
        refreshAll: function() {
            this.refreshFromNode($(document));
        },
        refreshFromNode: function(node, options) {
            var that = this,
                done, onFinishedReceived;

            if (options && options.onFinished) {
                done = options.onFinished;
                onFinishedReceived = 0;
                options.onFinished = function() {
                    onFinishedReceived = onFinishedReceived + 1;
                    if (onFinishedReceived === _.keys(ModulsConstructors).length) {
                        done();
                    }
                };
            }

            _.each(ModulsConstructors, function(ModulConstructor) {
                that.refresh(ModulConstructor, node, options);
            });
        },
        refresh: function(ModulConstructor, node, options) {
            var elements;
            if (ModulConstructor.prototype.className) {
                elements = node.find('.' + ModulConstructor.prototype.className);
            } else if (ModulConstructor.prototype.tagName) {
                elements = node.find(ModulConstructor.prototype.tagName);
            } else {
                throw 'La classe ' + ModulConstructor.prototype.name + ' necessita la propietat className o tagName';
            }
            this.refreshElements(elements.toArray(), ModulConstructor, options);
        },
        refreshElements: function(elements, ModulConstructor, options) {
            this.nonBlockingBatchAction(elements, _.bind(function(element) {
                this.refreshElement($(element), ModulConstructor, options);
            }, this), options);
        },
        refreshElement: function(element, ModulConstructor, options) {
            var node = $(element),
                modulInstance,
                dataModul = node.data().modul,
                reusedView;
            if (dataModul === undefined || dataModul[ModulConstructor.prototype.name] === undefined) {
                reusedView = this.getReusedView(element, ModulConstructor, options);
                if (reusedView) {
                    reusedView.reAtachToNode(node);
                } else {
                    modulInstance = new ModulConstructor({
                        el: element
                    });
                    if (options && options.parent) {
                        options.parent.addChildView(modulInstance);
                        modulInstance.setParentView(options.parent);
                    }
                    dataModul = dataModul || {};
                    dataModul[ModulConstructor.prototype.name] = modulInstance;
                    ModulsInstances.push(modulInstance);
                    node.data('modul', dataModul);
                }
            } else {
                element.trigger('refresca');
            }
        },
        cleanDettachedModuls: function() {
            var isDetached;
            ModulsInstances = _.compact(_.map(ModulsInstances, function(modul) {
                isDetached = (modul.$el.parents('.prerendering').length === 0 && modul.$el.parents('html').length === 0 && !modul.isNodeRetained());
                if (isDetached) {
                    //Plugins.Log.print('destroyed view: ' + modul.name);
                    modul.destroy();
                    return null;
                }
                return modul;
            }));
        },
        getReusedView: function(element, ModulConstructor, options) {
            var key, child;
            if (options && options.parent) {
                key = element.data('key');
                if (key) {
                    child = options.parent.getChildViewByKey(key);
                    if (child && child.$el.data().modul && child.$el.data().modul[ModulConstructor.prototype.name]) {
                        return child;
                    }
                }
            }
            return;
        },
        nonBlockingBatchAction: function(elements, action, options) {
            if (!elements || elements.length === 0) {
                if (options && options.onFinished) {
                    options.onFinished();
                }
                return;
            }
            var startTime = Date.now(),
                element = elements.pop();
            while (element) {
                action(element);
                if (Date.now() - startTime < MaxCalculationTime) {
                    element = elements.pop();
                } else {
                    element = null;
                }
            }
            window.requestAnimationFrame(_.bind(function() {
                this.nonBlockingBatchAction(elements, action, options);
            }, this));
        }
    };
}(window, $, _, Backbone));
/*jslint nomen: false*/