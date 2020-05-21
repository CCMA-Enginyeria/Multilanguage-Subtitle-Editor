/*globals
    define, Backbone, _, jitConfig, require
*/

/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app}
 */

define(['model/spa-app', '../router', '../global'],
    function(SpaAppModel, router, Global) {
        var SpaAppViewModel = Backbone.Model.extend({

            defaults: {
               
            },
            router: router,

            constructor: function SpaAppViewModel() {
                Backbone.Model.prototype.constructor.apply(this, arguments);
            },
            
            initialize: function() {
                Global.initialize();
                this.model = new SpaAppModel();

                this.router.on('route', _.bind(this.onRouteChanged, this));
                setTimeout(function() {
                    Backbone.history.start();
                }, 100);
                
            },

            onRouteChanged: function(id, params) {
                if (id === 'default' || id === 'notFound') {
                    router.navigate("editor", {
                    trigger: true,
                        replace: true
                    });
                }else if(id==='test'){
                    console.log(params)
                    var testName = params[0] || 'index';
                    require(['./utils/testengine','./tests/' + testName],function(TestEngine,testArray){
                        TestEngine.launch(testArray);
                    })
                } else {                    
                    this.set({
                        page: 'pages/' + id,
                        routeParams: (params && params.length > 0) ? params[0] : null,                        
                        allRouteParams: _.compact(params)
                    });
                    this.trigger('render')
                }
            },

            onFrontendUpperVersion: function() {
                this.set({
                    frontendUpperVersion: this.model.get('frontendUpperVersion')
                });
            },
            onFrontendLowerVersion: function() {
                this.set({
                    frontendLowerVersion: this.model.get('frontendLowerVersion')
                });
            },
            onAppUpperMajorVersion: function() {
                this.set({
                    appUpperMajorVersion: this.model.get('appUpperMajorVersion')
                });
            },
            onAppLowerMajorVersion: function() {
                this.set({
                    appLowerMajorVersion: this.model.get('appLowerMajorVersion')
                });
            },
            onAppUpperMinorVersion: function() {
                this.set({
                    appUpperMinorVersion: this.model.get('appUpperMinorVersion')
                });
            },
            onAppLowerMinorVersion: function() {
                this.set({
                    appLowerMinorVersion: this.model.get('appLowerMinorVersion')
                });
            },
            onUpdateFrontend: function() {
                this.set({
                    updateFrontend: this.model.get('updateFrontend'),
                    updateFrontendInfo: this.model.get('updateFrontendInfo')
                });
            },
            onUpdateApp: function() {
                this.set({
                    updateApp: this.model.get('updateApp'),
                    updateAppInfo: this.model.get('updateAppInfo')
                });
            },
            onUpdateApi: function() {
                this.set({
                    updateApi: this.model.get('updateApi'),
                    updateApiInfo: this.model.get('updateApiInfo')
                });
            },

            _onModelChanged: function() {
                this.set({
                    isloading: false
                });
            }
        });
        return SpaAppViewModel;

    });