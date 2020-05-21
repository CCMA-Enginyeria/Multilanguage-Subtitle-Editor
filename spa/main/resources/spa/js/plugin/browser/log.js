define([], function() {
    return {
        print: function(text) {
            console.debug(text);
        },
        clean: function() {
            console.clear();
        }
    }
});