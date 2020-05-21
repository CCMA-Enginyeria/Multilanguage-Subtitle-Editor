#!/bin/bash
echo ""
echo "-----------------------------------"
echo "--------- Script PostRemove -------"
echo "------ Paquet default php ---------"
echo "-----------------------------------"
echo ""

ENV_=/opt/jit-home/scripts/env/home-scripts-env.bash

# carreguem les propietats basiques de l'entorn si les tenim
if [ -e "$ENV_" ]; then
    . "$ENV_"
fi
. /opt/jit-home/scripts/home-global.bash

# Eliminem el host de digition.dtvc.local per la càrrega de dades dinàmiques (nomes quan eliminem el paquet completament)
if [ "$1" -eq '0' ]; then
    if [[ "$JIT_ENV" == 'dev' ]]; then

        delete_host 192.168.56.101 'digition-dev.dtvc.local'

        # Esborrem els fitxers d'aquest entorn
        rm -vf /etc/httpd/conf.d/digition.dtvc.local.conf

        # Com que s'esborra un .conf, fem un restart de l'Apache
        logger_debug "Fent restart de l'Apache.."
        /sbin/service httpd restart
        logger_debug 'Fet'
    fi
    if [[ "$JIT_ENV" == 'test' ]]; then
        delete_host 172.26.61.11 'digition-test.dtvc.local'

        # Esborrem els fitxers d'aquest entorn
        rm -vf /etc/httpd/conf.d/digition.dtvc.local.conf

        # Com que s'esborra un .conf, fem un restart de l'Apache
        logger_debug "Fent restart de l'Apache.."
        /sbin/service httpd restart
        logger_debug 'Fet'
    fi
fi

echo "...END POST REMOVE CONFIGURATION."