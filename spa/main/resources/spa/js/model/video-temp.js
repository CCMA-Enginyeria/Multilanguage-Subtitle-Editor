/**
 * @module model/digition-app
 */

define([], function () {
    var instance = null;
    var VideoTempModel = Backbone.Model.extend({

        defaults: {
            videoType: 'video/mp4',
            videoToPlay: null,
            currentTime: 0,
            subtitlesSrc: '',
            cuepoints: '',
            timeupdated: 0,
            typingBehavior: false,
            videoLoaded: false,
            reviewerActive: false,
            showViewed: false,
            showAccepted: true,
            showEdited: false,
            showRejected: false,
        },

        initialize: function (models, options) {
            this.videoType = options.get('videotype');
            this.videoToPlay = null,
                this.assetName = options.get('asset_name');
            this.showViewed = false;
            this.showAccepted = true;
            this.showEdited = false;
            this.showRejected = false;
            this.subtitlesSrc = options.subtitlesCollection.autosubtitlesfile;
            Backbone.Collection.prototype.initialize.apply(this, arguments);
            instance = this;
            this.videoLoaded = false;

        },

        _changeVideoTempSubtitlesFile: function (ev) {
            this.subtitlesSrc = ev;
        },

    }, {
        getInstance: function (model, options) {
            instance = instance ? instance : new VideoTempModel(model, options);
            return instance;
        }
    });

    return VideoTempModel;
});