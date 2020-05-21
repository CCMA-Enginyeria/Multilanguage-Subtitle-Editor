define([], function() {
    return {
        getUser: function() {
            if (localStorage.getItem("Usuari")) { //recuperem el darrer usuari logat amb la mateixa sessió del browser
                return localStorage.getItem("Usuari");
            } else {
                return null;
            }
        },
        getDomain: function() {
            return false;
        }
    }
});