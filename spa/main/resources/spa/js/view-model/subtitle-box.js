/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app}
 */

define(['model/subtitle-box','model/subtitles-logic','model/modal-title-description','model/modal-template'],
    function(SubtitleBoxModel,SubtitlesLogicModel,ModalTitleModel,ModalTemplateModel) {
        var SubtitleBoxViewModel = Backbone.Model.extend({

            defaults: {
                begintime: '--:--:--',
                origsubt: '...',
                autosubt: '...',
                newsubt: '...',
                endtime: '--:--:--',
                edited: false, 
                viewed: false,
                lastWorked: false,
                acceptedtext: 'Not done',
                accepted: '',
                focus: false,
                isRTL: false,
                changeCount: 0,
            },
            
            initialize: function(model, options) {
                this.model = options.model;
                if(options.model.collection.reviewerActive){                    
                    this.model.set('reviewerActive',true);
                }else{
                    this.model.set('reviewerActive',false);
                }
                this.listenTo(this.model, 'change', this._onModelChanged); 
                newsubt = this.replaceAll(this.model.get('ebuttText'),' xmlns:tt="http://www.w3.org/ns/ttml"','');               
                this.onMouseOverToggle = _.debounce(_.bind(this.onMouseOverToggle, this), 50);
                this._onModelChanged();      
                this.subtitlesLogicModel = SubtitlesLogicModel.getInstance();
            },
     
            onCancelEdition: function(){
                this.set('changeCount',this.get('changeCount')+1)
                this.model.set({
                    editionOnCourse:false
                });
                if(this.isReviewerActive() && this.model.get('edited')){

                }else{
                    cancelledObj = {
                        newsubt: this.model.get('lastsubt'),
                        newsubt2: this.model.get('lastsubt2'),
                    }
                    this.onProposedModified(cancelledObj,false);
                } 
            },

            onMouseOverToggle: function(value){
                if(this._mouseOver !== value) {
                    this._mouseOver = value;
                    if(this._mouseOver) {
                        this.onMouseOverUndo();
                    } else {
                        this.onMouseOutUndo();
                    }
                }
            }, 
            onMouseOverUndo: function(){
                this.set({
                    newsubt :this.model.get('textAuto'),
                    newsubt2:this.model.get('textAuto2'),
                    edited: false,
                })
            }, 
            onMouseOutUndo: function(){                
                this.set({
                    newsubt:this.model.get('newsubt'),
                    newsubt2:this.model.get('newsubt2'),
                    edited: this.model.get('edited'),
                })                
            }, 

            onClickUndoProposed: function(){
                UndoObject = {
                    newsubt: this.model.get('textAuto'),
                    newsubt2: this.model.get('dualText') ? this.model.get('textAuto2') : "",
                }
                if(this.isReviewerActive()){                    
                    this.onProposedModified(UndoObject,false,true)            
                }else{
                    this.onProposedModified(UndoObject,true,true)
                }
                this.model.set({
                    'editionOnCourse':false,
                });
            },
            onRejectSubtitle: function(){
                this.model.set({
                    conflict: true,
                    accepted: false,                    
                });
                this._setLastWorkedOn();
            },

            onAddLine: function(){
                this.model.set('dualText',true);
            },

            onRemoveLine: function(){
                this.model.set('dualText',false);
            },

            onProposedModified: function(value,mustChangeAccepted,isUndo,ev){
                var changeObj = {};
                changeObj['newsubt'] = value.newsubt;
                changeObj['newsubt2'] = value.newsubt2;
                if(this.model.get('accepted') && mustChangeAccepted) changeObj['accepted'] = false;
                this._getOverflowCharCount(value);

                //Different Behavior between Reviewer and Editor 
                //Check if input text is equal to that of the automated translation
                if(value.newsubt.trim() == this.model.get('textAuto').trim() && value.newsubt2.trim() == this.model.get('textAuto2').trim()){
                    if(isUndo){
                        changeObj['reviewerEdited'] = false;
                        changeObj['edited'] = false;
                        changeObj['conflict'] = false;
                        if(this.get('reviewerActive')){changeObj['accepted'] = false}; 
                    }else{
                        if(this.get('reviewerActive')){
                            changeObj['reviewerEdited'] = false;
                        }else{
                            changeObj['edited'] = false;
                        } 
                    }
                }else{
                    var newsubt1Condition = value.newsubt.trim()==this.model.get('lastsubt').trim();
                    var newsubt2Condition = value.newsubt2.trim()==this.model.get('lastsubt2').trim();
                    if(this.get('reviewerActive')){
                        if(!newsubt1Condition || !newsubt2Condition){
                            changeObj['reviewerEdited'] = true;
                            changeObj['accepted'] = true;
                        }
                    }else{
                        if(!newsubt1Condition || !newsubt2Condition){
                            changeObj['edited'] = true;
                        }
                    }               
                    changeObj['conflict'] = false;
                    
                    this._setLastWorkedOn();
                }
                this.model.set(changeObj);

                if(ev){
                    if(ev.type == "keydown"){
                        this.focusNextBox();
                    }
                }
                
            },

            onAcceptSubtitlebox: function() {
                if(this.isReviewerActive()){
                    this.model.set({
                        accepted: true,
                        lastsubt: this.model.get('newsubt'),
                        lastsubt2: this.model.get('newsubt2'),
                        conflict: false,
                        editionOnCourse:false,
                    })
                }else{
                    if(this.model.get('accepted')){
                        this.model.set('accepted', false);
                        if(this.model.get('edited')){
                            this.model.set('editionOnCourse', true);
                        }
                    }else{
                        this.model.set({
                            editionOnCourse:false,
                            accepted: true,
                            conflict: false,
                            lastsubt: this.model.get('newsubt'),
                            lastsubt2: this.model.get('newsubt2'),
                        });
                    };
                }
                this._setLastWorkedOn();
            },

            focusNextBox: function(){
                var indexToFocus = 9000;
                var focusmade=false;
                this.model.collection.forEach( _.bind(function(item,index){
                    if(this.model === item){
                        indexToFocus = index+1
                    }
                    if(!focusmade){
                        if(index >= indexToFocus){
                            if(!item.get('hideBox')){                               
                                $('#my-video').trigger('videoTimeChanged', {
                                    ms: (item.get('begin')/1000).toFixed(3)
                                });
                                focusmade=true;
                            }
                        }
                    }                    
                },this));
            },

            focusPreviousBox: function(){
                var indexToFocus = -9000;
                
                this.model.collection.some( _.bind(function(item,index){
                    if(item.get('focus') && this.model === item){
                        indexToFocus = index-1;
                        return true;
                    }
                },this));
                if(this.model.collection.models[indexToFocus]){
                    $('#my-video').trigger('videoTimeChanged', {
                        ms: (this.model.collection.models[indexToFocus].get('begin')/1000).toFixed(3)
                    }); 
                }           
            },

            isLastModel: function(){
                return this.model.get('lastmodel');
            },
            isReviewerActive: function(){
                return this.model.get('reviewerActive');
            },
            isFocusedClick: function(){
                return this.model.get('focusedClick');
            },

            _isModalOpen(){
                return ModalTemplateModel.getInstance().get('isShown') || ModalTitleModel.getInstance().get('isShown')
            },
            
             _onModelChanged: function() {                 
                this.set({
                    begintime: this._msToTime(this.model.get('begin')),
                    origsubt: this.model.get('textContent'),
                    origsubt2: this.model.get('textContent2'),
                    newsubt: this.model.get('newsubt'),
                    newsubt2: this.model.get('newsubt2'),
                    lastsubt: this.model.get('lastsubt'),
                    lastsubt2: this.model.get('lastsubt2'),
                    dualText: this.model.get('dualText'),
                    endtime: this._msToTime(this.model.get('end')),
                    edited: this.model.get('edited'), 
                    editedUndo: this.model.get('edited') || this.model.get('reviewerEdited'),
                    conflict: this.model.get('conflict'), 
                    reviewerActive: this.model.get('reviewerActive'),
                    reviewerEdited: this.model.get('reviewerEdited'),
                    viewed: this.model.get('viewed'),
                    lastWorked: this.model.get('lastWorked'),
                    accepted: this.model.get('accepted'),
                    subnumber: this.model.get('subnumber') + " / " +this.model.collection.length,
                    focus: this.model.get('focus'),   
                    hideBox: this.model.get('hideBox'), 
                    editionOnCourse: this.model.get('editionOnCourse'),
                    isRTL: this.model.get('isRTL'),
                    textOverflow: this.model.get('textOverflow'),
                    focusedClick: this.model.get('focusedClick'),
                    focusEnabled: this.model.get('focusEnabled'),
                    isCorrection: this.model.get('isCorrection'),
                    id: this.model.get('id'),
                });         
                if(this.model.get('focus')){                   
                    this.trigger('focused', {focus: this.model.get('focus'),})
                }else{
                    this.model.set('focusedClick',false);
                }                
                this._getOverflowCharCount({
                    newsubt: this.get('newsubt'),
                    newsubt2: this.get('newsubt2'),
                })
            },
            BoxClicked: function(ev){
                if(!this.model.get('focusedClick')){
                    this.model.set({
                        focusedClick:true,                    
                    });
                }else{
                    this.model.set({
                        focusedClick:true,                    
                    });
                }

                var indexToFocus = 9000;
                var focusmade=false;
                this.model.collection.forEach( _.bind(function(item,index){
                    if(this.model === item){
                        indexToFocus = index
                    }
                    if(!focusmade){
                        if(index >= indexToFocus){
                            if(!item.get('hideBox')){                               
                                $('#my-video').trigger('videoTimeChanged', {
                                    ms: (item.get('begin')/1000).toFixed(3)
                                });
                                focusmade=true;
                            }
                        }
                    }                    
                },this));

            },

            _setEditionOnCourseSilent(ev){
                if(!this.isReviewerActive()){
                    this.model.set({
                        editionOnCourse:true,
                        edited: true,
                    },{
                        silent:true,
                    });
                }
            },

            _objectSize: function(obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            },

            _getOverflowCharCount: function(string){
                var arr = []
                var subtitletime = (this.model.get('end') - this.model.get('begin'))/1000
                var charcount = subtitletime*20
                var evaluatorArray = [string.newsubt, string.newsubt2]
                for(i=0;i<evaluatorArray.length;i++){
                    if(!_.isEmpty(evaluatorArray[0])){
                        var arraypusher = evaluatorArray[i].match(/\S+/g)
                        if(arraypusher){
                            for(j=0;j<arraypusher.length;j++){
                                arr.push(arraypusher[j]);
                            }
                        }
                    }
                }
                if(arr){
                    arr.join("").length >= charcount ?  this.model.set('textOverflow',true):   this.model.set('textOverflow',false);  
                }else{
                    this.model.set('textOverflow',false);  
                }                                
            },

            _setLastWorkedOn: function(){
                this.model.trigger('lastWorkedOn',this);
                this.model.set('lastWorked',true)
            },

            _msToTime: function(time){
                var HH = Math.floor(time/3600000);//time%3600000
                var MM = Math.floor(time/60000) - HH*60;//time%60000
                var ss = Math.floor(time/1000) -HH*3600 -MM*60;//time%1000
                var mili = time - HH*3600000 - MM*60000 -ss*1000;
                mili = this._lpad(mili.toString(), 3);

                return HH + ':' + MM + ':' + ss + ':' + mili
            },

            _rpad: function(padString, length) {
                var str = padString;                
                while (str.length < length) var str = str + "0";
                return str;
            },

            _lpad: function(padString, length) {
                var str = padString;                
                while (str.length < length) var str = "0" + str;
                return str;
            },

            _timeToMs: function(time){
                var splittedTime = time.split(":");
                var ms = +splittedTime[0]*3600 + +splittedTime[1]*60 + +splittedTime[2] + +("0." + this._rpad(splittedTime[3], 3));
                return ms
            },

            replaceAll: function(str, find, replace) {
                if(!(str == null)){
                    return str.replace(new RegExp(find, 'g'), replace);
                };
            },
            
        });
        return SubtitleBoxViewModel;

    });