#!/bin/bash
echo ""
echo "-----------------------------------"
echo "--------- Script PostInstall-------"
echo "------ Paquet default php ---------"
echo "-----------------------------------"
echo ""

ENV_=/opt/jit-home/scripts/env/home-scripts-env.bash

# carreguem les propietats basiques de l'entorn si les tenim
if [ -e "$ENV_" ]; then
    . "$ENV_"
fi
. /opt/jit-home/scripts/home-global.bash



case $JIT_ENV in
    'dev')
        logger_debug "Entorn detectat: $JIT_ENV"

        # Afegim el nou host al /etc/hosts
        add_host 192.168.56.101 'digition-dev.dtvc.local'

        # Copiem els fitxers necessaris per aquest entorn
        cp -vf ${digition.install.dir}/config/dev.digition.dtvc.local.conf /etc/httpd/conf.d/digition.dtvc.local.conf

        # Movem documentació per a que estigui disponible online
        rsync -a ${digition.install.dir}/doc/ ${digition.install.dir}/web/doc/

        # Com que es puja un .conf, fem un graceful de l'apache
        logger_trace "Fent graceful de l'Apache.."
        /sbin/service httpd graceful
        logger_trace 'Fet'
        ;;
    'test')
        logger_debug "Entorn detectat: $JIT_ENV"
        # Afegim el nou host al /etc/hosts
        add_host 172.26.61.11 'digition-test.dtvc.local'

        # Copiem els fitxers necessaris per aquest entorn
        cp -vf ${digition.install.dir}/config/test.digition.dtvc.local.conf /etc/httpd/conf.d/digition.dtvc.local.conf
        cp -vf ${digition.install.dir}/config/test.paths.js ${digition.install.dir}/web/js/config/paths.js

        # Movem documentació per a que estigui disponible online
        rsync -a ${digition.install.dir}/doc/ ${digition.install.dir}/web/doc/ 

        # Com que es puja un .conf, fem un graceful de l'apache
        logger_trace "Fent graceful de l'Apache.."
        /sbin/service httpd graceful
        logger_trace 'Fet'
        ;;
    'pre')
        logger_debug "Entorn detectat: $JIT_ENV"

        # Preparem els fitxers necessaris per aquest entorn
        cp -vf ${digition.install.dir}/config/pre.paths.js ${digition.install.dir}/web/js/config/paths.js

        ;;
    'beta')
        logger_debug "Entorn detectat: $JIT_ENV"

        # Preparem els fitxers necessaris per aquest entorn
        cp -vf ${digition.install.dir}/config/beta.paths.js ${digition.install.dir}/web/js/config/paths.js

        ;;
    'pro')
        logger_debug "Entorn detectat: $JIT_ENV"

        # Preparem els fitxers necessaris per aquest entorn
        cp -vf ${digition.install.dir}/config/pro.paths.js ${digition.install.dir}/web/js/config/paths.js

        ;;
    *)
        logger_error "Entorn detectat: desconegut. Valor de variable JIT_ENV=$JIT_ENV."
        ;;
esac

echo "...END POST INSTALL CONFIGURATION."