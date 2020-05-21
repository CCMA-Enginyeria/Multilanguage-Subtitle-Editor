/**
 * Collection que verifica que l'usuari està autenticat i en cas que no ho estigui esperar a estar-ho per fer la crida al servidor
 * @module model/super/authorization-collection
 * @requires module:model/super/authorization
 * @requires module:model/super/submodel-collection
 */

define(['./authorization', './submodel-collection'],
    function(Authorization, SubmodelCollection) {

        var AuthorizationCollection = SubmodelCollection.extend(
            _.extend({},
                Authorization, {
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

        return AuthorizationCollection;
    });