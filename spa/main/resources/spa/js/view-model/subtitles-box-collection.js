/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app}
 */

define(['model/subtitles-box-collection', './subtitle-box', 'model/video-temp', 'model/modal-template'],
    function (SubtitlesBoxCollectionModel, SubtitleBoxVM, VideoTempModel, ModalTemplateModel) {
        var instance = null;
        var SubtitlesBoxCollectionViewModel = Backbone.Model.extend({

            viewmodel: SubtitleBoxVM,
            subtitlebox: [],
            subtitles: null,
            subtOriginalLoaded: false,
            VideoTempModel: null,
            xmldocument: '',

            defaults: {
                editedNum: 0,
                currentSubNumber:0,
                editedPerc: 0,
                acceptedNum: 0,
                acceptedPerc: 0,
                viewedNum: 0,
                viewedPerc: 0,
                totalNum: 0,
                totalPerc: 0,
                editeddocument: document, 
                defaultFilter: "All",
                filterValue: "1",
            },

            initialize: function (model, options) {
                this.set({
                    state: options.state,
                })
                this.model = SubtitlesBoxCollectionModel.getInstance(model, options);
                if(options.state == "Reviewer"){
                    this.reviewerActive = true;
                    this.model.reviewerActive = true;
                }else{
                    this.model.reviewerActive = false;
                    this.reviewerActive = false;
                }
                this.defaultFilter = "All"; filterValue="1"
                this.modalModel = ModalTemplateModel.getInstance();
                this.videoTempModel = VideoTempModel.getInstance(model, options);

                this.model.stopVideoTypingBehavior = true;
                this.model.focusBehavior = true;
                this.listenTo(this.model, 'sync', this._onModelChanged);
                this.listenTo(this.videoTempModel, 'change:currentTime', this.scrollToFocus);
                this.listenTo(this.model, 'scrollToFocusAccepted', this.scrollToFocus);
                this.listenTo(this.model, 'changeBehavior', this.onChangeTypingBehavior);
                this._onModelChanged();
                this.listenTo(this.model, 'changePercentages', this._onChangePercentages);
                this.listenTo(this.model, 'lastWorkedOn', this._changeLastWorked);
                this.listenTo(this.model,'creditsRemoved creditsAdded',this.renderSubtitles);
                this.model.getSubtitlePluginData();

                   
            },

            //scrollToFocus listens for changes in the current time due to seeking or playing the video
            //and marks the box that is being edited for the correspondent timeframe
            scrollToFocus: function (ev) {
                var time = (+ev.get('currentTime')).toFixed(3) *1000                
                var lastmodel = 0;
                var focusedflag = false;
                var isReviewerActive = this.reviewerActive
                var subfocused = 0;

                this.model.models.forEach(_.bind(function (item, index) {
                    if ((item.get('begin') <= time+10) && (item.get('end') > time)) {
                        var changedObject = {
                            focus: true,
                            viewed:true,                           
                        };
                        if(isReviewerActive && !item.get('conflict') && this._playerIsPlaying()) {
                            changedObject.accepted = true;
                        }
                        focusedflag = true;
                        subfocused = index;
                        item.set(changedObject);
                    } else item.set('focus', false);
                    //If there is no subtitle matching the time, get the one that
                    //had the last end time match
                    if (item.get('end') < time) lastmodel = index;                    
                }, this))
                if (!focusedflag){
                    this.model.models[lastmodel].set('focus', true);
                    subfocused = lastmodel
                }
                this.currentSubNumber = subfocused
            },

            getModelByIndex: function (index) {
                return this.model.at(index);
            },

            getHidden: function (index) {
                return this.model.at(index).get('hideBox');
            },

            onFinishToXML: function (value) {
                this.model.sendToFinish();
                return;
            },

            onSaveToXML: function (value) {
                this.model.sendToSave();
                return;
            },

            onChangeTypingBehavior: function(){
                this.model.stopVideoTypingBehavior = !this.model.stopVideoTypingBehavior;
                this.model.trigger('typingBehavior', this.model.stopVideoTypingBehavior)
            },

            onChangeFocusBehavior: function(){
                this.model.focusBehavior = !this.model.focusBehavior;
                this.model.models.forEach(_.bind(function(item,index){
                    item.set('focusEnabled',this.model.focusBehavior)
                },this))
            },

            onChangeBoxSelector: function (value,textvalue) {
                this.set('loading',true)        
                this.set({
                    defaultFilter:textvalue,
                    filterValue: value,
                });  
                setTimeout(_.bind(function() {                 
                    this.model.models.forEach(function (item, index) {
                        switch(value){
                            case "1": item.set('hideBox', false) 
                            break;
                            case "2": item.get('accepted')? item.set('hideBox', false) : item.set('hideBox', true);
                            break;
                            case "3": item.get('edited') == true ? item.set('hideBox', false) : item.set('hideBox', true); 
                            break;
                            case "4":
                                if(item.get('reviewerActive')){
                                    !item.get('accepted') ? item.set('hideBox', false) : item.set('hideBox', true);
                                }else{
                                    !(item.get('accepted')) || ((item.get('edited') == true) && !(item.get('accepted'))) ?  item.set('hideBox', false) : item.set('hideBox', true);
                                }break;
                            case "5":  item.get('conflict') ? item.set('hideBox', false) : item.set('hideBox', true);
                            break;
                            case "6": item.get('newsubt') == '' ? item.set('hideBox',false) : item.set('hideBox',true)
                            break;
                            case "7": item.get('textOverflow')? item.set('hideBox',false) : item.set('hideBox',true)
                            break;
                        }
                    });     
                    this.set('loading',false)
                },this),1000);
                setTimeout(_.bind(function(){this.trigger('checkEmptyResults')},this), 2000);
            },


            onLoadFirstTime: function(){
                this.model.models.forEach(function (item, index) {
                    if(item.get('lastWorked')){
                        item.set('focus',true);
                        $('#my-video').trigger('videoTimeChanged', {
                            ms: item.get('begin')/1000
                        });
                    }
                });
                var ObjEditPerc = {}
                    ObjEditPerc['editorViewPerc'] = this.model.jsondata.viewed_percent_editor,
                    ObjEditPerc['editorEditPerc'] = this.model.jsondata.edited_percent_editor,
                    ObjEditPerc['editorValidPerc'] = this.model.jsondata.validated_percent_editor,
                    ObjEditPerc['length'] = this.model.length
                if(this.model.reviewerActive) this.trigger('renderEditorPerc', ObjEditPerc);               
            },

            _onModelChanged: function (options) {
                if (this.isSubtOriginalLoaded() && this.model.isAutoLoaded()) {
                    this.editeddocument = this.model.defaultdocument,
                    this.finishEnabled = this.model.finishEnabled,

                    this.set({
                        subtitles: this.model.map(function (m, i) {
                            return i;
                        }),
                    });
                }
                if (this.model.isOriginalLoaded() && !this.model.isAutoLoaded())  this.model.getSubtitlePluginData();
                this.set({
                    reviewerActive: this.model.reviewerActive,    
                    originalLanguage: this.model.originalLanguage,
                    translatedLanguage: this.model.translatedLanguage, 
                    defaultFilter: this.defaultFilter, 
                    filterValue: this.filterValue,
                })
            },

            getEditorPercentages: function(){
                if(this.isSubtAutoLoaded()){
                    var ObjEditPerc = {}
                    ObjEditPerc['editorViewPerc'] = this.model.jsondata.viewed_percent_editor,
                    ObjEditPerc['editorEditPerc'] = this.model.jsondata.edited_percent_editor,
                    ObjEditPerc['editorValidPerc'] = this.model.jsondata.validated_percent_editor                     
                    return ObjEditPerc
                }
            },

            getPercentages: function(value){
                if(value) this._onChangePercentages();
            },

            renderSubtitles: function(){
                this.onLoadFirstTime();
                this._onModelChanged();
                this.trigger("renderSubtitles");
            },

            _playerIsPlaying: function() {
                return this.videoTempModel.get('isPlaying');
            },

            _onChangePercentages: function (ev) {
                var percentageObject = ev
                if(ev) this.trigger('rerenderPerc', percentageObject)
                
            },

            _changeLastWorked: function (ev) {
                this.model.models.forEach(function (item, index) {
                    item.set({
                        lastWorked: false
                    },{
                        silent:true,
                    })
                })
            },

            isAccepted: function (modelElement) {
                return modelElement.get('accepted')
            },
            
            isEdited: function (modelElement) {
                return modelElement.get('edited');
            },

            isSubtOriginalLoaded() {
                return this.model.isOriginalLoaded();
            },

            isSubtAutoLoaded() {
                return this.model.isAutoLoaded();
            },

        },{
            getInstance: function (model, options) {
                instance = instance ? instance : this
                return instance;
            },destroyInstance: function () {
                instance = null;
            }
        });
        return SubtitlesBoxCollectionViewModel;

    });