/**
 * Model que verifica que l'usuari està autenticat i en cas que no ho estigui esperar a estar-ho per fer la crida al servidor
 * @module model/super/authorization-model
 * @requires module:model/super/authorization
 * @requires module:model/super/submodel-model
 */

define(['./authorization', './submodel-model'], function(Authorization, SubmodelModel) {

    var AuthorizationModel = SubmodelModel.extend(_.extend({}, Authorization, {
        /*
         * -----------------------------------------------
         * Valors per defecte
         * -----------------------------------------------
         */

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
    }));

    return AuthorizationModel;
});