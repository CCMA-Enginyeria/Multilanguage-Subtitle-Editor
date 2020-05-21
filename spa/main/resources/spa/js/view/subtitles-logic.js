/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header} 
 * @see {@link module:view/container} 
 * @see {@link module:view/login-container} 
 * @see {@link module:view/generic-modal-container} 
 */

define(['view-model/subtitles-logic', './super/vm-view', './subtitles-box-collection'],
    function(SubtitlesLogicViewModel, VMView, SubtitlesBoxCollection) {
        ModulJitpub.add({  

            name: 'subtitles-logic',
            className: 'subtitles-logic-view',
            templateName: 'subtitles-logic',
            ViewModel: SubtitlesLogicViewModel,
            subtitlesboxcollectionView: SubtitlesBoxCollection,

            initialize: function() {
                this.BaseModul.prototype.initialize.apply(this, arguments);                                

            },

            afterRender: function() {
                this.BaseModul.prototype.afterRender.apply(this, arguments);     
            },
            getViewModel: function() {
                return new this.ViewModel(null, {
                    'state': this.$el.data('state'), 
                    'jobid': this.$el.data('jobid'), 
                });
            },

            vmEvents: {
                'change' : 'render',
            },

            events: {   

            },

        }, VMView);
    });