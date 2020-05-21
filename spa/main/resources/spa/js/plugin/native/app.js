define([], function() {
    return {
        newInstance: function(url) {
            if ('newInstance' in window.external) {
                window.external.newInstance(url);
            }
        },
        newIE: function(url) {
            if ('newIE' in window.external) {
                window.external.newIE(url);
            }
        },
        showConfig: function() {
            if ('showAdvancedConfig' in window.external) {
                window.external.showAdvancedConfig();
            }
        },
        newBrowserWindow: function(title, url) {
            if ('newBrowserWindow' in window.external) {
                window.external.newBrowserWindow(title, url);
            }
        },
        newPlayerWindow: function(title) {
            if ('newPlayerWindow' in window.external) {
                window.external.newPlayerWindow(title);
            }
        },
        localStorageSetItem: function(keyName, keyValue) {
            if ('localStorageModified' in window.external) {
                localStorage.setItem(keyName, keyValue);
                window.external.localStorageModified(keyName);
            }
        },
        messageBox: function(message) {
            if ('msgBox' in window.external) {
                window.external.msgBox(message);
            } else {
                alert(message);
            }
        },
        confirm: function(message) {
            if ('confirm' in window.external) {
                return window.external.confirm(message);
            } else {
                return confirm(message);
            }
        },
        getAppVersion: function() {
            if ('getAppVersion' in window.external) {
                return window.external.getAppVersion();
            }
        },
        beep: function() {
            if ('beep' in window.external) {
                window.external.beep();
            }
        },
        browseFolder: function() {
            return window.external.browseFolder();

        },
        insertPeticioDownloadAudio: function(videoOrigen, siNomFitxerDesti, xmlName, xmlSoundFile, xmlFolder, xmlItemCode, codecDesti) {
            if ('insertPeticioDownloadAudio' in window.external) {
                return window.external.insertPeticioDownloadAudio(videoOrigen, siNomFitxerDesti, xmlName, xmlSoundFile, xmlFolder, xmlItemCode, codecDesti);
            } else {
                return true;
            }
        },
        insertPeticioDownloadAudioFromVideo: function(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, tcIn, tcOut) {
            if ('insertPeticioDownloadAudioFromVideo' in window.external) {
                return window.external.insertPeticioDownloadAudioFromVideo(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, tcIn, tcOut);
            } else {
                return true;
            }
        },
        inserirPeticioDownloadVideoLQ: function(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, isMP4, tcIn, tcOut) {
            if ('inserirPeticioDownloadVideoLQ' in window.external) {
                return window.external.inserirPeticioDownloadVideoLQ(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, isMP4, tcIn, tcOut);
            } else {
                return true;
            }
        },
        inserirPeticioDownloadVideoHQ: function(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, isMP4, tcIn, tcOut) {
            if ('inserirPeticioDownloadVideoHQ' in window.external) {
                return window.external.inserirPeticioDownloadVideoHQ(videoOrigen, audioOrigen1, audioOrigen2, audioOrigen3, audioOrigen4, fitxerDesti, isMP4, tcIn, tcOut);
            } else {
                return true;
            }

        },
        realitzaPeticionsDownload: function() {
            if ('realitzaPeticionsDownload' in window.external) {
                window.external.realitzaPeticionsDownload();
            }

        },
        resetPeticionsDownload: function() {
            if ('resetPeticionsDownload' in window.external) {
                window.external.resetPeticionsDownload();
            }
        },
        initializePeticionsDownload: function() {
            if ('initializePeticionsDownload' in window.external) {
                window.external.initializePeticionsDownload();
            }
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
            if ('fileExists' in window.external) {
                return window.external.fileExists(path);
            } else {
                return true;
            }

        },
        isValidPath: function(path) {
            //només comprova path windows format
            var result = new RegExp(/(^([a-z]|[A-Z]):(?=\\(?![\0-\37<>:"/\\|?*])|\/(?![\0-\37<>:"/\\|?*])|$)|^\\(?=[\\\/][^\0-\37<>:"/\\|?*]+)|^(?=(\\|\/)$)|^\.(?=(\\|\/)$)|^\.\.(?=(\\|\/)$)|^(?=(\\|\/)[^\0-\37<>:"/\\|?*]+)|^\.(?=(\\|\/)[^\0-\37<>:"/\\|?*]+)|^\.\.(?=(\\|\/)[^\0-\37<>:"/\\|?*]+))((\\|\/)[^\0-\37<>:"/\\|?*]+|(\\|\/)$)*()$/i).test(path);
            return result;
        },

    }
});