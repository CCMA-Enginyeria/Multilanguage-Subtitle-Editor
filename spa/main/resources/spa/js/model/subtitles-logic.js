/**
 * @module model/digition-app
 */

define(['./subtitles-box-collection', './tab-logic'], function (SubtitlesBoxCollection, TabLogicCollection) {
    var instance = null;
    var SubtitlesLogicModel = Backbone.Model.extend({

        model: SubtitlesBoxCollection,
        loaded: false,
        jsondata: '',
        subtitlesCollection: null,
        videoTemp: null,
        defaults: {
            instancecreated: false,
            videotype: 'video/mp4',
            videotoplay: 'videotest.mp4',
        },

        initialize: function () {
            this.tabcollectionmodel = TabLogicCollection.getInstance();
            if (!this.tabcollectionmodel.jsondata) {
                this.listenTo(this.tabcollectionmodel, 'sync', this.JsonFetched)
            } else {
                this.JsonFetched();
            }
        },

        JsonFetched: function () {
            this.subtitlejsondata = this.tabcollectionmodel.jsondata;
            this.subtitlesCollection = SubtitlesBoxCollection.getInstance();
            this.set(this.parse(this.subtitlejsondata));
            this.loaded = true;
        },

        isLoaded: function () {
            return this.loaded;
        }

    }, {
        getInstance: function () {
            instance = instance ? instance : new SubtitlesLogicModel();
            return instance;
        },
        destroyInstance: function () {
            instance = null;
        }
    });

    return SubtitlesLogicModel;
});