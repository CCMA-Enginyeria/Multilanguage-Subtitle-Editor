/**
 * @module view/tooltip
 * @requires module:view/super/renderable-view
 * @example
 */

define(['./super/base'], function(BasicView) {
    ModulJitpub.add({

        name: 'tooltip',
        className: 'tooltip-view',

        initialize: function() {
            this.BaseModul.prototype.initialize.apply(this, arguments);
            this.$el.tooltip({trigger : 'hover'});
        },

        events: {                  
            'click' : 'hide',
        },

        hide: function(){
            this.$el.tooltip('hide');
            if(document.getElementsByClassName('tooltip').length != 0){
                document.getElementsByClassName('tooltip')[0].remove();
            };
        },

    }, BasicView);
});