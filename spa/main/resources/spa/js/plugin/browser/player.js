/*globals
    define, console, $
*/
define('plugin/browser/player', ['model/player-debug'], function(playerDebugModel) {
    return {
        loadVideo: function(siClipName, siTCMediaInici, siTCInicial, siTCSaltar, siTCFinal, liPosicio, siTipus, liFrameRate, biAutoPlay) {
            /*jslint unparam:true*/
            console.log('[Player Plugin] loadVideo method not implemented');
            console.log(arguments);
            playerDebugModel.add(arguments.callee.name + " " + siClipName + " " + siTCMediaInici + " " + siTCInicial + " " + siTCSaltar + " " + siTCFinal + " " + liPosicio + " " + siTipus + " " + liFrameRate + " " + biAutoPlay );
        },
        play: function() {
            console.log('[Player Plugin] play method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        seek: function() {
            console.log('[Player Plugin] seek method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        pause: function() {
            console.log('[Player Plugin] pause method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        stop: function() {
            console.log('[Player Plugin] stop method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        show: function() {
            console.log('[Player Plugin] show method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        hide: function() {
            console.log('[Player Plugin] hide method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },

        size: function(width, height) {
            /*jslint unparam:true*/
            console.log('[Player Plugin] size method not implemented');
        },
        position: function(x, y) {
            /*jslint unparam:true*/
            console.log('[Player Plugin] position method not implemented');
        },
        showModal: function(x, y, w, h) {
            /*jslint unparam:true*/
            console.log('[Player Plugin]  showModal not implemented');
        },
        hideModal: function() {
            console.log('[Player Plugin] hideModal method not implemented');
        },
        isShown: function() {
            return false;
        },
        getPlayerTC: function() {
            console.log('[Player Plugin] getPlayerTC method not implemented');
            playerDebugModel.add(arguments.callee.name);
            return "--:--:--:--";
        },
        getVideoPath: function() {
            console.log('[Player Plugin] getVideoPath method not implemented');
            playerDebugModel.add(arguments.callee.name);
            return "";
        },
        showAudioPlayer: function() {
            console.log('[Player Plugin] show method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        hideAudioPlayer: function() {
            console.log('[Player Plugin] hide method not implemented');
            playerDebugModel.add("Hide Audio Player");
        },
        loadAudio: function(siAudioName, biAutoPlay) {
            /*jslint unparam:true*/
            console.log('[Player Plugin] loadAudio method not implemented');
            playerDebugModel.add(arguments.callee.name + " " + siAudioName + " " + biAutoPlay);
        },
        showInDefaultProgram: function(filePath) {
            /*jslint unparam:true*/
            console.log('[Player Plugin] showInDefaultProgram method not implemented');
            playerDebugModel.add(arguments.callee.name + " " + filePath);
        }
    };
});