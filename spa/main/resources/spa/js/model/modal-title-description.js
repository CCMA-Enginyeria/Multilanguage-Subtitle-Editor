/**
 * @module model/digition-app
 */

define([], function () {
    var instance = null;
    var ModalTitleTemplateModel = Backbone.Model.extend({

        defaults: {
            originalSynopsis: "No Original Synopsis loaded",
            originalTitle: "No Title loaded",
            autoSynopsis: "No Automated Synopsis loaded",
            autoTitle: "No Automated Title loaded",
            translatedSynopsis: "No Translated Synopsis loaded",
            translatedTitle: "No Translated Title loaded",
            synopsisEdited: false,
            titleEdited: false,
            synopsisReviewerEdited: false,
            titleReviewerEdited: false,
            synopsisAccepted: false,
            titleAccepted: false,
            synopsisConflict: false,
            titleConflict: false,
            isShown: false,
            synopsisOnCourse: false,
            editedSynopsisUndo: false,
            titleOnCourse: false,
            editedTitleUndo: false,
            isReviewerActive: false,
            isRTL: false,
            author: "Default author title model",
            creditsAdded: true,
        },

        _isReviewerActive: function () {
            return this.get('state') === "Reviewer" ? true : false;
        }

    }, {
        getInstance: function () {
            instance = instance ? instance : new ModalTitleTemplateModel();
            return instance;
        },
        destroyInstance: function () {
            instance = null;
        }
    });

    return ModalTitleTemplateModel;
});