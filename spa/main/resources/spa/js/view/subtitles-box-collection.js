/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header} 
 * @see {@link module:view/container} 
 * @see {@link module:view/login-container} 
 * @see {@link module:view/generic-modal-container} 
 */

define(['view-model/subtitles-box-collection', './super/vm-view', './subtitle-box', 'view-model/modal-template'],
    function(SubtitlesBoxCollectionViewModel, VMView, SubtitleBox, ModalViewModel) {
        ModulJitpub.add({  

            name: 'subtitles-box-collection',
            className: 'subtitles-box-collection-view',
            templateName: 'subtitles-box-collection',
            ViewModel: SubtitlesBoxCollectionViewModel,
            subtitleboxView: SubtitleBox,
            ModalTemplateViewModel: ModalViewModel,

            initialize: function() {
                this.BaseModul.prototype.initialize.apply(this, arguments);
                this.loadedfirsttime=false;
            },

            afterRender: function() {
                this.BaseModul.prototype.afterRender.apply(this, arguments);
                if(!this.loadedfirsttime){
                    this.viewModel.onLoadFirstTime();
                    this.loadedfirsttime=true;
                    this.modalView = this.ModalTemplateViewModel;
                }
                this.viewModel.getPercentages(!this.viewModel.get('loading'));
            },

            getViewModel: function() {
                return new this.ViewModel(null, {
                    'state': this.$el.data('state')
                });
            },            

            destroy: function() {               
                this.BaseModul.prototype.destroy.apply(this, arguments);
            },

            vmEvents: {                                
                'selectorChanged': 'renderSelectionAmount',
                'change:loading' : 'render',
                'checkEmptyResults' : 'checkEmptyResults',
                'renderSubtitles': 'renderSubtitles',
            },
   
            renderSubtitles: function(){
                this.render();
            },
            
            renderPercentages: function(ev){
                this.$el.find('#subNumber')[0].textContent = ev.subTotalNumber
                this.$el.find('#acceptedNum')[0].textContent = ev.acceptedNum
                if(ev.reviewerActive){
                    this.$el.find('#modifiedNum')[0].textContent = ev.modifiedNum
                    this.$el.find('#conflictNum')[0].textContent = ev.conflictNum
                }else{
                    this.$el.find('#editedNum')[0].textContent = ev.editedNum
                    this.$el.find('#viewedNum')[0].textContent = ev.viewedNum
                }                
            },

            checkEmptyResults: function(){
                if(this.$('.subtitle-box-replaced-view.view-attached:not([hidden])').length == 0){
                    document.getElementById('emptyResults').innerHTML = "</br> No results matched";
                }else{
                    document.getElementById('emptyResults').innerHTML = "";
                }
            },

            events: {        
                'click a.refresh-filter-action':'refreshFilter',                
                'click .dropdown-item': 'changeFilterValue',
                'hidden.bs.dropdown .dropdown':'onChangeBoxSelector',
                
            },

            changeFilterValue(ev){
                ev.preventDefault();
                document.getElementById('emptyResults').innerHTML = "";
                document.getElementById('dropdownMenuButton').innerHTML = $(ev.currentTarget)[0].innerHTML;
                document.getElementById('dropdownMenuButton').setAttribute('value', $(ev.currentTarget)[0].getAttribute('value'));
            },

            refreshFilter:function(e){
                e.preventDefault();
                document.getElementById('emptyResults').innerHTML = "";
                this.viewModel.onChangeBoxSelector(document.getElementById('dropdownMenuButton').getAttribute('value'),document.getElementById('dropdownMenuButton').innerHTML.trim());

            },

            onChangeBoxSelector: function(ev){
                document.getElementById('emptyResults').innerHTML = "";   
                this.viewModel.onChangeBoxSelector(document.getElementById('dropdownMenuButton').getAttribute('value'),document.getElementById('dropdownMenuButton').innerHTML.trim());
             
            },

        }, VMView);
    });