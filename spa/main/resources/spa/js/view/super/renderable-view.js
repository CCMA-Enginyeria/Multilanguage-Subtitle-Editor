/*globals
  define, _, $, ModulJitpub, SPADebugTools
*/

/**
 * Aquesta vista rendertiza el template que s'hagi definit dins de l'atribut templateName.
 * <br/>
 * Aquesta vista no conté view-model, per tant, només s'hauria d'utilitzar en vistes 
 * que no tenen model de dades assignat o el seu model de dades estigui a una vista pare.
 * <br/>
 * L'arquetype és : view/renderable-view.js
 * @module view/super/renderable-view
 * @requires module:view/super/base
 */

define(['./base'], function(BaseModul) {
    window._viewRenderTime = window._viewRenderTime || {};
    var RenderableView = BaseModul.extend({

        /**
         * -----------------------------------------------
         * Configuració bàsica
         * -----------------------------------------------
         */
        templateName: null,
        debugButtonTemplateName: 'debug-button',

        /**
         * Indica si l'element s'ha de renderitzar abans d'apareixer al DOM
         * @type {Boolean}
         */
        waitForRender: true,

        /**
         * Indica si l'element s'ha de renderitzar remplaçant el ja existent
         * @type {Boolean}
         */
        replaceHtml: true,

        /**
         * -----------------------------------------------
         * Inicialització del mòdul
         * -----------------------------------------------
         */
        initialize: function() {
            BaseModul.prototype.initialize.apply(this, arguments);
            this.props = this.getProps();
            this.prepareForFirstRender();
            this.render();
        },

        /**
         * -----------------------------------------------
         * Funció que serà cridada per obtenir les propietats
         * -----------------------------------------------
         */
        getProps: function() {
            var props = this.$el.data('props');
            this.$el.removeData('props');
            return props || {};
        },


        /**
         * -----------------------------------------------
         * Funció que serà cridada abans del mètode render
         * -----------------------------------------------
         */
        beforeRender: function(onFinishCallback) {
            onFinishCallback();
        },

        /**
         * -----------------------------------------------
         * Funció que serà cridada abans del mètode render
         * -----------------------------------------------
         */
        render: function() {
            if (!this.templateName) {
                return;
            }
            if (this.isRendering) {
                this.mustRevalidate = true;
                return true;
            }
            this.isRendering = true;
            var profile = SPADebugTools.startProfile(this.name),
                data;
            this.getTemplate(_.result(this, 'templateName'), _.bind(function(tpl) {
                this.beforeRender(_.bind(function() {
                    data = this.getRenderData();
                    this.renderTemplateWithDataIfNeeded(tpl, data, _.bind(function() {
                        this.waitForRender = false;
                        this.trigger('view.render');
                        this.isRendering = false;
                        if (this.mustRevalidate) {
                            this.mustRevalidate = false;
                            window.requestAnimationFrame(_.bind(this.render, this));
                        }
                        profile.end();
                    }, this));
                }, this));
            }, this));
        },

        /**
         * -----------------------------------------------
         * Funció que serà cridada després de renderitzar-se
         * -----------------------------------------------
         */
        afterRender: function() {
            return;
        },

        onAttached: function() {
            this.$el.addClass('view-attached');
            this.afterRenderRequest = window.requestAnimationFrame(_.bind(this.afterRender, this));
            BaseModul.prototype.onAttached.apply(this, arguments);
        },

        /**
         * -----------------------------------------------
         * Funció que serà cridada després de renderitzar-se
         * -----------------------------------------------
         */
        prepareAfterRender: function() {
            if (this.$el.parents('.prerendering').length === 0) {
                this.onAttached();
            }
        },

        /**
         * -----------------------------------------------
         * Funció que retornarà les dades que es passaran al template
         * -----------------------------------------------
         */
        getRenderData: function() {
            return {
                data: this.$el.data()
            };
        },

        /**
         * -----------------------------------------------
         * Funció que serà cridada a l'hora de destruir el mòdul
         * -----------------------------------------------
         */
        destroy: function() {
            this.$el.removeData();
            BaseModul.prototype.destroy.apply(this, arguments);
        },

        /**
         * -----------------------------------------------
         * Mètode que rendertizarà un template amb dades en cas que aquestes hagin canviat
         * -----------------------------------------------
         */
        renderTemplateWithDataIfNeeded: function(tpl, nextRenderData, callback) {
            var shouldRender = this.viewShouldRender(nextRenderData, this.previousRenderData);
            if (shouldRender) {
                this.previousRenderData = $.extend(true, {}, nextRenderData);
                this.dettachReusableChildrenViews();
                this.getNextElementWithTemplate(tpl, nextRenderData, _.bind(function(nextEl) {
                    this.insertNewEl(nextEl);
                    this.prepareAfterRender();
                    callback();
                }, this));
            } else {
                callback();
            }
        },

        /**
         * -----------------------------------------------
         * Funció que retornarà el codi HTML que s'afegirà a l'element
         * -----------------------------------------------
         */
        renderTemplateWithData: function(tpl, data) {
            return tpl(data);
        },

        /**
         * -----------------------------------------------
         * Retorna el pròxim element que es renderitzarà
         * -----------------------------------------------
         */
        getNextElementWithTemplate: function(tpl, data, callback) {
            var el = this.renderTemplateWithData(tpl, data);
            el = this.wrapContentInsidePrerendering(el);
            this.renderDebugButton(el, _.bind(function(el) {
                this.beforeCreateSubviews(el);
                this.initSubviewsForNewEl(el, _.bind(function() {
                    var renderContent = this.removePrerenderWrapper(el);
                    callback(renderContent);
                }, this));
            }, this));
        },

        /**
         * -----------------------------------------------
         * Inserta el nou element rendertizat
         * -----------------------------------------------
         */
        insertNewEl: function(el) {
            if (this.replaceHtml) {
                var data = this.$el.data();
                this.$el.replaceWith(el);
                this.setElement(el);
                this.$el.data(_.extend(data, this.$el.data)).addClass(this.name + '-replaced-view');
            } else {
                this.$el.html(el);
            }
        },

        /**
         * -----------------------------------------------
         * Funció que serà cridada abans de crear les subvistes
         * -----------------------------------------------
         */
        beforeCreateSubviews: function(el) {
            this.assignProps(el);
        },

        /**
         * -----------------------------------------------
         * Assignació de propietats a les vistes filles
         * -----------------------------------------------
         */
        assignProps: function(el) {
            var props,
                propName,
                that = this;
            el.find('*[class*=-view]').each(function(i, view) {
                /*jslint unparam:true*/
                view = $(view);
                props = {};
                _.each(view.data(), function(v, k) {
                    if (k.indexOf('props') === 0) {
                        propName = k.substring(5).toLowerCase();
                        props[propName] = _.reduce(v.split('.'), that.getPropValue, that);
                    }
                });
                view.data('props', props);
            });
        },

        /**
         * -----------------------------------------------
         * Envolcalla l'element per poder afegir-ho com a fill
         * -----------------------------------------------
         */
        wrapContentInsidePrerendering: function(el) {
            var prerenderTag = this.getPrerenderTagName(el);
            return $($.parseHTML('<' + prerenderTag + ' class="prerendering">' + el + '</' + prerenderTag + '>'));
        },

        /**
         * -----------------------------------------------
         * Retorna el tagName del node on es ficarà el contingut
         * -----------------------------------------------
         */
        getPrerenderTagName: function(el) {
            this.isTr = el.trim().indexOf('<tr') === 0;
            return this.isTr ? 'table' : 'div';
        },

        /**
         * -----------------------------------------------
         * Esborra l'envolcall de l'element a renderitzar
         * -----------------------------------------------
         */
        removePrerenderWrapper: function(el) {
            return this.isTr ? el.find('tr') : el.children();
        },

        /**
         * -----------------------------------------------
         * Inicialitza les vistes filles
         * -----------------------------------------------
         */
        initSubviewsForNewEl: function(el, callback) {
            ModulJitpub.refreshFromNode(el, {
                parent: this,
                onFinished: _.bind(function() {
                    this.childrenViews = _.filter(this.childrenViews, function(v, i) {
                        /*jslint unparam:true*/
                        return !v.shoulRemoveFromParentView();
                    });
                    ModulJitpub.cleanDettachedModuls();
                    this.waitUntilSubviewsAreRendered(el, function() {
                        callback();
                    });
                }, this)
            });
        },

        /**
         * -----------------------------------------------
         * Espera a que les vistes filles s'hagin inicialitzat
         * -----------------------------------------------
         */
        waitUntilSubviewsAreRendered: function(el, callback) {
            /*jslint unparam:true*/
            var subviewsToBeWaited = _.filter(this.childrenViews, function(view) {
                    return view.waitForRender;
                }),
                //var subviewsToBeWaited = el.find('[data-wait-for-render=true]'),
                subviewRendered = 0,
                onViewRenderReceived = function() {
                    subviewRendered = subviewRendered + 1;
                    if (subviewRendered === subviewsToBeWaited.length) {
                        callback();
                    }
                };
            if (subviewsToBeWaited.length === 0) {
                callback();
            } else {
                _.each(subviewsToBeWaited, function(view) {
                    view.once('view.render', onViewRenderReceived);
                }, this);
            }
        },

        /**
         * -----------------------------------------------
         * Desenganxa les vistes filles per poder ser reaprofitades
         * -----------------------------------------------
         */
        dettachReusableChildrenViews: function() {
            _.each(this.childrenViews, function(v) {
                v.detach();
            });
        },

        /**
         * -----------------------------------------------
         * Retorna el valor d'una propietat
         * -----------------------------------------------
         */
        getPropValue: function(obj, key) {
            /*jslint regexp: true */
            var functionRegex = /(.*[\(]*)\(([^)]+)\)/,
                functionRegexResult = functionRegex.exec(key);
            if (functionRegexResult && functionRegexResult.length >= 2) {
                return obj[functionRegexResult[1]].apply(obj, functionRegexResult[2].split(','));
            }
            return obj ? _.result(obj, key) : null;
        },

        /**
         * -----------------------------------------------
         * Determina si la vista ha de pintar el botó de debug
         * -----------------------------------------------
         */
        hasDebugButton: function() {
            return false;
        },

        /**
         * -----------------------------------------------
         * Determina si estem en mode debug
         * -----------------------------------------------
         */
        hasDebugMode: function() {
            return false;
        },

        /**
         * -----------------------------------------------
         * Retorna les dades que es pintaran en el botó de debug
         * -----------------------------------------------
         */
        getDebugData: function() {
            return {
                templateName: this.templateName,
                viewName: this.name
            };
        },

        /**
         * -----------------------------------------------
         * Mètode per pintar el botó de debug
         * -----------------------------------------------
         */
        renderDebugButton: function(el, callback) {
            if (window.isDebugMode && this.hasDebugButton()) {
                this.getTemplate(this.debugButtonTemplateName, _.bind(function(tpl) {
                    var debugEl = tpl(this.getDebugData());
                    el.prepend(debugEl);
                    callback(el);
                }, this));
            } else {
                callback(el);
            }
        },

        /**
         * -----------------------------------------------
         * Inicialitza el node abans del primer render 
         * -----------------------------------------------
         */
        prepareForFirstRender: function() {
            var markedWaitForRender, markedReplaceHtml;
            if (this.waitForRender) {
                markedWaitForRender = this.$el.data('waitForRender');
                this.waitForRender = this.waitForRender && this.templateName && (markedWaitForRender !== false);
                this.$el.attr('data-wait-for-render', this.waitForRender);
            }
            if (this.replaceHtml) {
                markedReplaceHtml = this.$el.data('replaceHtml');
                this.replaceHtml = markedReplaceHtml === true;
                this.$el.attr('data-replace-html', this.replaceHtml);
            }
        },

        /**
         * -----------------------------------------------
         * Mètode que decideix si una vista s'ha de renderitzar o no
         * -----------------------------------------------
         */
        viewShouldRender: function(nextData, previousData) {
            return !_.isEqual(nextData, previousData);
        }
    });
    return RenderableView;
});