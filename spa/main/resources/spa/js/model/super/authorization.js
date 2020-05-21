/**
 * Classe abstracta que permet que un model o una collection comprovi que l'usuari està autenticat
 * @module model/super/authorization
 */

define([], function() {

    var Authorization = {

        /*
         * -----------------------------------------------
         * Valors per defecte
         * -----------------------------------------------
         */
        isLoading: false,
        retryIfAuthError: true,

        /*
         * -----------------------------------------------
         * Inicialització
         * -----------------------------------------------
         */


        /*
         * -----------------------------------------------
         * Overwrites
         * -----------------------------------------------
         */
        sync: function(method, model, options) {
            this.isLoading = true;
            this.getToken(_.bind(function(token) {
                this.token = token;
                this.syncWithAuthentication(method, model, options);
            }, this));
        },

        /*
         * -----------------------------------------------
         * Accions
         * -----------------------------------------------
         */

        /*
         * -----------------------------------------------
         * Helpers
         * -----------------------------------------------
         */
        syncWithAuthentication: function(method, model, options) {
            var wrappedSyncOptions, originalError, originalSuccess;
            wrappedSyncOptions = options ? _.clone(options) : {};
            wrappedSyncOptions.beforeSend = _.bind(this.sendAuthentication, this);
            originalError = wrappedSyncOptions.error;
            wrappedSyncOptions.error = _.bind(function(xhr) {
                this.onSyncError(xhr);
                if (xhr.status === 401) {
                    this.onAuthError(method, model, options);
                }
                originalError.apply(this, arguments);
            }, this);
            originalSuccess = wrappedSyncOptions.success;
            wrappedSyncOptions.success = _.bind(function(resp, status, xhr) {
                this.onSyncSuccess(xhr);
                originalSuccess.apply(this, arguments);
            }, this);
            this.xhr = this.parentPrototype.sync.apply(this, [method, model, wrappedSyncOptions]);
        },
        sendAuthentication: function(xhr) {
            xhr.setRequestHeader('Authorization', this.token);
        },
        onSyncError: function(xhr) {
            this.isLoading = false;
            var res;
            try {
                res = JSON.parse(xhr.responseText);
            } catch (e) {
                res = {
                    "missatge": "Error"
                };
            }


            //utilitzem un atribut, no un nou submodel, per poder-ho utilitzar en una Col·lecció.
            this.error = new Backbone.Model({
                "debugInfo": res.debugInfo,
                "missatge": res.missatge
            });
        },
        onSyncSuccess: function(xhr) {
            this.isLoading = false;
            var token = xhr.getResponseHeader('Authorization');
            if (token) {
                this.refreshToken(token);
            }
        },
        onAuthError: function(method, model, options) {
            window.authTokenModel.logout();
            if (this.retryIfAuthError) {
                this.getToken(_.bind(function() {
                    this.sync(method, model, options);
                }, this));
            }
        },
        getToken: function(cb) {
            window.authTokenModel.getToken(function(token) {
                cb(token);
            });
        },
        refreshToken: function(token) {
            window.authTokenModel.setToken(token);
        }
    };

    return Authorization;
});