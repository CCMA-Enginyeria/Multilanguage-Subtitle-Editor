define([], function() {
    return {
        getUser: function() {
            if ('getUser' in window.external) {
                var result = null,
                    lStorageUser = (localStorage.getItem("Usuari")) ? localStorage.getItem("Usuari").toLowerCase() : null,
                    localUser = window.external.getUser().toLowerCase();

                if (lStorageUser === localUser) {
                    result = localUser;
                }

                return result;
            } else {
                return '';
            }
        },
        getDomain: function() {
            if ('getDomain' in window.external) {
                return window.external.getDomain();
            }
        }
    }
});