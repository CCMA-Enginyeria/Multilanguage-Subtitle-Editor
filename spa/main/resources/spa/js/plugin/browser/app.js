define('plugin/browser/app', ['model/player-debug'], function(playerDebugModel) {
    return {
        newInstance: function(url) {
            window.open(url, "", "");
        },
        newIE: function(url) {
            window.open(url, "", "");
        },
        showConfig: function() {
            console.log('[Player Plugin] showConfig method not implemented');
        },
        newBrowserWindow: function(title, url) {
            return window.open(url);
        },
        newPlayerWindow: function(title) {
            console.log('[Player Plugin] newPlayerWindow method not implemented');
        },
        localStorageSetItem: function(keyName, keyValue) {
            localStorage.setItem(keyName, keyValue);
        },
        messageBox: function(message) {
            alert(message);
        },
        confirm: function(message) {
            return confirm(message);
        },
        getAppVersion: function() {
            console.log('[Player Plugin] getAppVersion method not implemented');
        },
        beep: function() {
            console.log('[Player Plugin] beep method not implemented');
        },
        browseFolder: function() {
            console.log('[Player Plugin] browseFolder method not implemented');
            return "";
        },
        insertPeticioDownloadAudio: function(fitxerOrigen, siNomFitxerDesti, xmlName, xmlSoundFile, xmlFolder, xmlItemCode, codecDesti) {
            console.log('[Player Plugin] insertPeticioDownloadAudio method not implemented');
            playerDebugModel.add(arguments.callee.name + " " + fitxerOrigen+ " " + siNomFitxerDesti+ " " + xmlName+ " " + xmlSoundFile+ " " + xmlFolder+ " " + xmlItemCode+ " " + codecDesti);
            return true;
        },
        insertPeticioDownloadAudioFromVideo: function(fitxerOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, tcIn, tcOut) {
            console.log('[Player Plugin] insertPeticioDownloadAudioFromVideo method not implemented');
            playerDebugModel.add(arguments.callee.name + " " + fitxerOrigen+ " " +  audioOrigen1+ " " +  audioOrigen2+ " " +  audioOrigen3+ " " +  audioOrigen4+ " " +  fitxerDesti+ " " +  tcIn+ " " +  tcOut);
            return true;
        },
        inserirPeticioDownloadVideoLQ: function(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, isMP4, tcIn, tcOut) {
            console.log('[Player Plugin] inserirPeticioDownloadVideoLQ method not implemented');
            playerDebugModel.add(arguments.callee.name + " " + videoOrigen+ " " + audioOrigen1+ " " + audioOrigen2+ " " + audioOrigen3+ " " + audioOrigen4+ " " + fitxerDesti+ " " + isMP4+ " " + tcIn+ " " + tcOut);
            return true;
        },
        inserirPeticioDownloadVideoHQ: function(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, isMP4, tcIn, tcOut) {
            console.log('[Player Plugin] inserirPeticioDownloadVideoHQ method not implemented');
            playerDebugModel.add(arguments.callee.name + " " + videoOrigen+ " " + audioOrigen1+ " " + audioOrigen2+ " " + audioOrigen3+ " " + audioOrigen4+ " " + fitxerDesti+ " " + isMP4+ " " + tcIn+ " " + tcOut);
            return true;
        },
        realitzaPeticionsDownload: function() {
            console.log('[Player Plugin] realitzaPeticionsDownload method not implemented');
            playerDebugModel.add(arguments.callee.name);
            return true;
        },
        resetPeticionsDownload: function() {
            console.log('[Player Plugin] resetPeticionsDownload method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        initializePeticionsDownload: function() {
            console.log('[Player Plugin] initializePeticionsDownload method not implemented');
            playerDebugModel.add(arguments.callee.name);
        },
        getDownloadFormatsFromBaixa: function() {
            var dbaixa = {
                download: [{
                    id: "MPG",
                    nom: "Mpeg/wmv (baixa qualitat)"
                }, {
                    id: "WAV_DA",
                    nom: "wav (Compatible Dalet)"
                }, {
                    id: "WAV_CD",
                    nom: "Wav (compatible CD)"
                }, {
                    id: "SND",
                    nom: "Snd (mpeg layer II)"
                }]
            };
            return dbaixa;
        },
        getDownloadFormatsFromAlta: function() {
            var dalta = {
                download: [{
                    id: "MP4A",
                    nom: "Mp4 (alta qualitat)"
                }, {
                    id: "MP4B",
                    nom: "Mp4 (baixa qualitat)"
                }, {
                    id: "AVI",
                    nom: "Avi (vídeo i àudio per separat)"
                }, {
                    id: "WAV_DA",
                    nom: "wav (Compatible Dalet)"
                }, {
                    id: "WAV_CD",
                    nom: "Wav (compatible CD)"
                }, {
                    id: "SND",
                    nom: "Snd (mpeg layer II)"
                }]
            };
            return dalta;
        },
        fileExists: function(path) {
            console.log('[Player Plugin] fileExists method not implemented');
            return true;
        },
        isValidPath: function(path) {
            console.log('[Player Plugin] isValidPath method not implemented');
            return true;
        },

    }
});