define([], function() {
    var debug = false,
        debugLineCounter = 0;

    if (debug) {
        var debugLayer = $('<div id="debugmsg" style="overflow: hidden; display: block; z-index: 999; position: absolute; right: 2%; top: 0px; width: 50%; height: 100%; background-color: rgba(0, 0, 0, 0.498039); color: rgb(0, 255, 0);"></div>');
        $('body').append(debugLayer);
    }

    return {
        print: function(text) {
            if (debug) {
                if (debugLineCounter == 25) cleanLog();
                this.debugLayer = this.debugLayer || function() {
                    var d = document.getElementById("debugmsg");

                    d.style.width = "50%";
                    d.style.display = "block"; // out "none"; in block
                    d.style.zIndex = "999";

                    return d;
                }();
                try {
                    this.debugLayer.innerHTML += "<br/>" + text;
                } catch (e) {

                }
                debugLineCounter++;
            }

        },
        clean: function() {
            if (debug) {
                debugLineCounter = 0;
                this.debugLayer.innerHTML = "";
            }
        }
    }
});