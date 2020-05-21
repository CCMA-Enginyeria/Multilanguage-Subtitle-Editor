
/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header} 
 * @see {@link module:view/container} 
 * @see {@link module:view/login-container} 
 * @see {@link module:view/generic-modal-container} 
 */

define(['view-model/subtitle-box', './super/vm-view'],
    function(SubtitleBoxViewModel, VMView) {
        ModulJitpub.add({  

            name: 'simple-subtitle-box',
            className: 'simple-subtitle-box-view',
            templateName: 'simple-subtitle-box',
            ViewModel: SubtitleBoxViewModel,

            initialize: function() {
                this.BaseModul.prototype.initialize.apply(this, arguments);                
            },
       
            afterRender: function() {
                this.BaseModul.prototype.afterRender.apply(this, arguments);
                if(this.viewModel.get('focus')) {
                    this.$el[0].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });                                                        
                }                 
            },

            vmEvents: {
               'change' : 'render',
            },

            events: {                             
                'click .on-click-box-action': 'onClickSubtitleBox',    
            },

            onClickSubtitleBox: function(ev){
                var ms = this.viewModel._timeToMs(this.$el[0].getElementsByClassName('R-tcin')[0].textContent);
                if(!(ms.toFixed(3) ==  $('#my-video')[0].currentTime)){
                    $('#my-video').trigger('videoTimeChanged', {
                        ms: this.viewModel._timeToMs(this.$el[0].getElementsByClassName('R-tcin')[0].textContent).toFixed(3)
                    });     
                }                
            },

        }, VMView);
    });