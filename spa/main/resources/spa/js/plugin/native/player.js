/*globals
    define, external, _
*/


define([], function() {
    window.external.StopClip();
    window.external.HidePlayer();
    return {
        loadVideo: function(siClipName, siTCMediaInici, siTCInicial, siTCSaltar, siTCFinal, liPosicio, siTipus, liFrameRate, biAutoPlay) {
            if (_.has(window.external, 'AddClip')) {
                window.external.AddClip(siClipName,
                    siTCMediaInici,
                    siTCInicial,
                    siTCSaltar,
                    siTCFinal,
                    liPosicio,
                    siTipus,
                    liFrameRate,
                    biAutoPlay);
            }
        },
        seek: function(siTCMediaInici, biAutoPlay) {
            if (_.has(window.external, 'seek')) {
                window.external.seek(siTCMediaInici, biAutoPlay);
            }
        },
        play: function() {
            if (_.has(window.external, 'PlayClip')) {
                window.external.PlayClip();
            }
        },
        pause: function() {
            if (_.has(window.external, 'PauseClip')) {
                window.external.PauseClip();
            }
        },
        stop: function() {
            if (_.has(window.external, 'StopClip')) {
                window.external.StopClip();
            }
        },
        show: function() {
            if (_.has(window.external, 'ShowPlayer')) {
                window.external.ShowPlayer();
            }
        },
        hide: function() {
            if (_.has(window.external, 'HidePlayer')) {
                window.external.HidePlayer();
            }
        },

        size: function(width, height) {
            if (_.has(window.external, 'resizePanel')) {
                window.external.resizePanel(width, height);
            }
        },
        position: function(x, y) {
            if (_.has(window.external, 'movePanel')) {
                window.external.movePanel(x, y);
            }
        },
        showModal: function(x, y, w, h) {
            if (_.has(window.external, 'showModal')) {
                window.external.showModal(x, y, w, h);
            }
        },
        hideModal: function() {
            if (_.has(window.external, 'hideModal')) {
                window.external.hideModal();
            }
        },
        isShown: function() {
            if (_.has(window.external, 'isPlayerShown')) {
                return window.external.isPlayerShown();
            }
        },
        getPlayerTC: function() {
            if (_.has(window.external, 'getPlayerTC')) {
                return window.external.getPlayerTC();
            }
        },
        getVideoPath: function() {
            if (_.has(window.external, 'getVideoPath')) {
                return window.external.getVideoPath();
            }
        },
        showAudioPlayer: function() {
            if (_.has(window.external, 'ShowAudioPlayer')) {
                window.external.ShowAudioPlayer();
            }
        },
        hideAudioPlayer: function() {
            if (_.has(window.external, 'HideAudioPlayer')) {
                window.external.HideAudioPlayer();
            }
        },
        loadAudio: function(siAudioFile, biAutoPlay) {
            if (_.has(window.external, 'loadAudio')) {
                window.external.loadAudio(siAudioFile, biAutoPlay);
            }
        },
        showInDefaultProgram: function(filePath) {
            if (_.has(window.external, 'showInDefaultProgram')) {
                window.external.showInDefaultProgram(filePath);
            }
        }
    };
});