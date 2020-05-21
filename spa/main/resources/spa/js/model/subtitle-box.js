/**
 * @module model/digition-app
 */

define([], function () {
    var SubtitleBoxModel = Backbone.Model.extend({

        defaults: {
            begintime: '--:--:--',
            origsubt: 'No subt file',
            autosubt: 'No auto file',
            newsubt: 'Empty',
            newsubt2: 'Empty',
            lastsubt: '',
            lastsubt2: '',
            endtime: '--:--:--',
            edited: false,
            reviewerEdited: false,
            conflict: false,
            lastWorked: false,
            accepted: '',
            viewed: false,
            focus: false,
            hideBox: false,
            isRTL: false,
            focusedClick: false,
        },


    });

    return SubtitleBoxModel;
});