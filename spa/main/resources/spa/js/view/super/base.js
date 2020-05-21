/**
 * És la vista més primitiva, únicament conté el sistema enganxar-se a un node del DOM existent.
 * <br/>
 * Aquesta vista només s'hauria d'utilitzar en cas que no es vulgui renderitzar res
 * però es vulguin agafar els events de l'usuari.
 * <br/>
 * L'arquetype és : view/basic-view.js
 * @module view/super/base
 */

define([], function() {
    window.deferredActions = window.deferredActions || {};

    var BaseModul = Backbone.View.extend({
        events: {},
        initialize: function() {},
        render: function() {},
        refrescaStandalone: function(url, callback) {
            this.$el.load(url + ' .' + this.className + '>', null, callback);
        },
        getTemplate: function(name, callback) {
            if (requirejs.specified('hbstemplate')) {
                require(['hbstemplate!' + jitConfig.staticsResourcesHost + '/templates/' + name], callback);
            } else {
                require([jitConfig.staticsResourcesHost + '/templates/' + name], callback);
            }
        },
        cancelDeferredAction: function(name) {
            //EQPUB-2023 definició createDeferredAction
            if (window.deferredActions[name]) {
                clearTimeout(window.deferredActions[name]);
                window.deferredActions[name] = null;
            }
        },
        createDeferredAction: function(name, action) {
            //EQPUB-2023 IPTV: per poder solucionar una colisió de gestió de focus entre moduls i navegació IPTV
            window.deferredActions[name] = setTimeout(function() {
                action();
            }, 0);
        },
        destroy: function() {
            this.stopListening();
            this.remove();
            this.childrenViews = null;
            this.parentView = null;
        },

        /*
         * -----------------------------------------------
         * Mètode que retorna el mapa de vistes per debuggar
         * -----------------------------------------------
         */
        getDebugName: function() {
            return this.name;
        },
        getChildrenMap: function() {
            var children = _.map(this.childrenViews, function(v) {
                return {
                    name: v.getDebugName(),
                    viewModel: !!v.viewModel,
                    children: v.getChildrenMap(),
                }
            });

            if (!this.parentView) {
                return {
                    name: this.getDebugName(),
                    viewModel: !!this.viewModel,
                    children: children,
                }
            } else {
                return children;
            }
        },

        /*
         * -----------------------------------------------
         * Mètode que es crida quan s'afegeix una vista filla
         * -----------------------------------------------
         */
        clearChildrenViews: function(view) {
            this.childrenViews = [];
        },

        /*
         * -----------------------------------------------
         * Mètode que es crida quan s'afegeix una vista filla
         * -----------------------------------------------
         */
        addChildView: function(view) {
            this.childrenViews = this.childrenViews || [];
            this.childrenViews.push(view);
        },

        /*
         * -----------------------------------------------
         * Mètode que es crida quan s'afegeix una vista filla
         * -----------------------------------------------
         */
        getChildViewByKey: function(key) {
            return _.find(this.childrenViews, function(view) {
                return view.$el.data('key') === key;
            });
        },

        /*
         * -----------------------------------------------
         * Mètode que desenganxa una vista del DOM. En cas que l'element del DOM es comparteixi amb la vista pare no es desenganxa
         * -----------------------------------------------
         */
        detach: function(parentView) {
            this.onDettached();
            if (this.isReusable()) {
                var isSharedDOMElement = (this.el === this.parentView.el);
                if (!isSharedDOMElement) {
                    //Create a fake element to prevent a bad UX
                    this.fillWithFakeElement();
                    this.$el = this.$el.detach();
                }
            }
            this.detached = true;
        },

        onAttached: function() {
            this.isAttached = true;
            _.each(this.childrenViews, function(v) {
                v.onAttached();
            });
        },

        onDettached: function() {
            this.isAttached = false;
            _.each(this.childrenViews, function(v) {
                v.onDettached();
            });
        },

        /*
         * -----------------------------------------------
         * Torna a enganxar la vista a un node del DOM
         * -----------------------------------------------
         */
        reAtachToNode: function(node) {
            this.detached = false;
            node.replaceWith(this.$el);
        },

        /*
         * -----------------------------------------------
         * Mètode que indica si la vista està no es pot esborrar
         * -----------------------------------------------
         */
        isNodeRetained: function() {
            var someViewRetained = _.find(this.$el.data().modul, function(view, k) {
                return (view.retainAlways && view.detached);
            });
            if (someViewRetained) {
                return true;
            }
            if (this.parentView) {
                return this.parentView.isNodeRetained();
            }
            return false;
        },

        /*
         * -----------------------------------------------
         * Mètode que indica una vista es pot reaprofitar
         * -----------------------------------------------
         */
        isReusable: function() {
            return !!this.$el.data('key');
        },

        /*
         * -----------------------------------------------
         * Mètode que indica si la vista ha de deixar ser filla de la vista pare
         * -----------------------------------------------
         */
        shoulRemoveFromParentView: function() {
            return !this.retainAlways && this.detached;
        },

        /*
         * -----------------------------------------------
         * Mètode que es crida quan una vista filla
         * -----------------------------------------------
         */
        setParentView: function(parentView) {
            this.parentView = parentView;
        },

        /*
         * -----------------------------------------------
         * Mètode que clona l'element actual i es crida quan una vista filla
         * -----------------------------------------------
         */
        fillWithFakeElement: function() {
            var fakeElement = $('<div></div>');
            fakeElement.insertAfter(this.$el);
            var cloned = this.$el.clone();
            fakeElement.replaceWith(cloned);
            $(document).trigger('RefrescaModulNode', {
                modul: 'hold-visual-state',
                node: cloned
            });
        }
    });
    return BaseModul;
});