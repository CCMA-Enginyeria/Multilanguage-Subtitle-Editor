/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header} 
 * @see {@link module:view/container} 
 * @see {@link module:view/login-container} 
 * @see {@link module:view/generic-modal-container}
 */

define(['view-model/modal-template', './super/vm-view'],
    function(ModalTemplateViewModel, VMView) {
        ModulJitpub.add({  

        
            name: 'modal-template',
            className: 'modal-template-view',
            templateName: 'modal-template', 
            ViewModel: ModalTemplateViewModel,           

            initialize: function() {
                this.BaseModul.prototype.initialize.apply(this, arguments);    
            },

            vmEvents: {
               'change': 'render',           
            },

            events: {                         
                'click .accept-action' : 'onClickAccept',                
                'click .discard-action' : 'onClickDiscard',
                'click .close-action' : 'onCloseAction',
                'click .cancel-action' : 'onCancel',
                'click .save-progress-action': 'onSaveProgress',
                'input .rejectarea' : 'onWriteRejectReason',
                'shown.bs.modal': 'onShown',
                'hidden.bs.modal': 'onHidden'
            },

            onShown: function() {
                this.viewModel.notifyModalVisibility(true);
            },
            onHidden: function() {
                this.viewModel.notifyModalVisibility(false);
            },
            onCloseAction: function(){
                this.viewModel._closeModal()
            },

            onWriteRejectReason: function(){
                reason = this.$el[0].getElementsByClassName('rejectarea')[0].value
                if(reason.length > 0){
                    document.getElementById('AcceptReject').removeAttribute('disabled');
                }else{
                    document.getElementById('AcceptReject').setAttribute('disabled',true);
                }
            },

            onSaveProgress: function(){
                this.viewModel.onClickSave();    
            },

            onCancel: function(e){
                e.preventDefault()
                this.viewModel.onClickCancel();   
            },
            onClickDiscard: function(e){
                e.preventDefault()
                this.viewModel.onClickDiscard();                   
            },

            onClickAccept: function(e){
                e.preventDefault()
                if(this.viewModel.get('rejectmodal')){
                    this.viewModel.onClickAccept(document.getElementById('textRejected').value);    
                }else{
                    this.viewModel.onClickAccept(e);
                }
            },            

        }, VMView);
    });