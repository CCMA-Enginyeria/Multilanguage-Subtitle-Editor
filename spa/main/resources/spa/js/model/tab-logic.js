/**
 * @module model/digition-app
 */

define(['./subtitles-box-collection', './iso639-1'], function (SubtitleBoxCollectionModel, ISO6391) {
    instance = null
    var TabLogicCollection = Backbone.Collection.extend({

        iso6391: ISO6391,
        defaults: {
            renderedpage: '',
            jsondata: '',
            originalLanguage: 'No original Language defined',
            outputLanguage: 'No output Language defined',
            dataloaded: false,
            allAccepted: false,
            jobid: "",
        },

        parse: function (incJSON) {
            this.loaded = true;
            this.jsondata = incJSON;
            this.originalLanguage = this.iso6391[this.jsondata.language_source];
            this.outputLanguage = this.iso6391[this.jsondata.language_target];
            this.dataloaded = true;
            return incJSON;
        },

        isLoaded: function () {
            return !!this.originalLanguage;
        },

    },
        {
            getInstance: function () {
                instance = instance ? instance : new TabLogicCollection();
                return instance;
            },
            destroyInstance: function () {
                instance = null;
            }
        });

    return TabLogicCollection;
});