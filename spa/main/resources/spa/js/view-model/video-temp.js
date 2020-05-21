/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app}
 */

define(['model/video-temp', '../global', 'model/subtitles-box-collection', 'model/modal-template', 'model/modal-title-description'],
    function (VideoTempModel, Global, SubtitlesBoxCollectionModel, ModalTemplateModel, ModalTitleModel) {
        var VideoTempViewModel = Backbone.Model.extend({

            videoType: 'video/mp4',
            videoToPlay: 'videotest.mp4',
            subtitlesBoxCollectionModel: null,
            subtitlesBoxCollectionviewModel: null,
            defaults: {
                subtitlesSrc: '',
                subtitlesId: 0,
            },

            constructor: function VideoTempViewModel() {
                Backbone.Model.prototype.constructor.apply(this, arguments);
            },

            initialize: function (model, options) {

                this.model = VideoTempModel.getInstance();

                if (options.state == "Reviewer") {
                    this.reviewerActive = true;
                    this.model.reviewerActive = true;
                } else {
                    this.model.reviewerActive = false;
                    this.reviewerActive = false;
                }

                this.listenTo(this.model, 'change', this._onModelChanged);
                this.listenTo(this.model, 'video_path', this.refreshVideo);
                this.subtitlesBoxCollectionModel = SubtitlesBoxCollectionModel.getInstance();

                this._onModelChanged();

                this.set(
                    {
                        videoToPlay: this.model.videoToPlay,
                        videoType: this.model.videoType,
                        assetName: this.model.assetName,
                    })
                this.modalModel = ModalTemplateModel.getInstance();
                this.modalTitleModel = ModalTitleModel.getInstance();
                this.listenTo(this.modalTitleModel, 'change:titleAccepted change:synopsisAccepted', this._changeTitleStatus)
                this.listenTo(this.subtitlesBoxCollectionModel, 'sync', this._mapSubtitles);

                this.set("subtitlesLoaded", false);

            },


            startListening: function () {
                this.tempInstance = SubtitlesBoxCollectionModel.getInstance()
                this.listenTo(this.tempInstance, 'change:newsubt change:newsubt2', this.onBoxCollectionChange);
                this.listenTo(this.tempInstance, 'change:viewed change:accepted', this.getSubtitlesSource);

                this.listenTo(this.tempInstance, 'change:viewed change:accepted change:rejected change:edited change:newsubt change:newsubt2', this._statsChanged);
                this.listenTo(this.model, 'change:showViewed change:showEdited change:showAccepted change:showRejected', this._statsChanged);

                this.listenTo(this.tempInstance, 'typingBehavior', this.changeTypingBehaviour);
                this.listenTo(this.tempInstance, 'sync', this._mapSubtitles);
            },
            refreshVideo: function (ev) {
                this.refreshVideoPath(ev);
            },

            getModelByIndex: function (index) {
                return this.subtitlesBoxCollectionModel.at(index);
            },

            changeTypingBehaviour: function (ev) {
                this.model.set('typingBehavior', ev);
            },

            onSeeking: function (value) {
                var elementFocused = this.subtitlesBoxCollectionModel.where({ focus: true })[0];
                if (elementFocused) {
                    var findItem = this.subtitlesBoxCollectionModel.where({ focus: true })[0].get('subnumber');
                    var itemlength = this.subtitlesBoxCollectionModel.length;
                    var subNumber = findItem + '/' + itemlength;
                    this.trigger('updateSubNumber', subNumber);
                }
                if (value) {
                    this.model.set('currentTime', value);
                    if (elementFocused) this.model.set('currentSubNumber', findItem + '/' + itemlength);
                }
            },

            getSubtitlesSource: function (ev) {

                return this.subtitlesBoxCollectionModel.getDefaultDocument();

            },

            onBoxCollectionChange: function () {
                this._onModelChanged();
                this.set({
                    subtitlesId: this.get('subtitlesId') + 1
                });
            },

            getHelpModal() {
                this.modalModel.set({
                    helpmodal: true,
                    savemodal: false,
                    finishmodal: false,
                    rejectmodal: false,
                    modaltitle: 'Help',
                    returnmodal: false,
                    dataAction: false,
                    errorModal: false,
                    successModal: false,
                    resetmodal: false,
                    errorText: "",
                    isShown: true,
                })
            },

            setVideoLoaded: function () {
                this.model.videoLoaded = true;
            },

            getVideoLoaded: function () {
                return this.model.videoLoaded;
            },

            isReviewer: function () {
                return this.reviewerActive;
            },

            isPlaying: function (ev) {
                this.model.set({
                    isPlaying: ev,
                });
            },
            refreshVideoPath: function (response, textStatus) {
                if (this.subtitlesBoxCollectionModel.json.job_id == 219) { //corre vola
                    this.trigger('url_refreshed', "https://mp4-down-medium-es.ccma.cat/2/1/1557832676012.mp4");
                } else if (this.subtitlesBoxCollectionModel.json.job_id == 218) { //llavors poma
                    this.trigger('url_refreshed', "https://mp4-down-medium-es.ccma.cat/4/5/1550799157554.mp4");
                } else if (this.subtitlesBoxCollectionModel.json.job_id == 217) { //FAQS
                    this.trigger('url_refreshed', "https://mp4-down-medium-int.ccma.cat/9/2/1563669492229.mp4");
                } else {
                    if (typeof response !== 'string') {
                        this.trigger('url_refreshed', textStatus);
                    } else {
                        this.trigger('url_refreshed', response);
                    }
                }

            },
            onVideoPathError: function (response, textStatus) {
                alert(JSON.parse(textStatus.responseText).code + ":  " + JSON.parse(textStatus.responseText).description +
                    "\n\nThere was an error loading the video source.\n You can try again refreshing this page.");
            },

            getVideoUrl: function () {
                var video_url_settings = ({
                    //Request settings
                });

                this.model.fetch(video_url_settings);
            },

            setSelectedStats: function (ev) {

                ev == "viewed" ? this.model.showViewed = true : this.model.showViewed = false;
                ev == "accepted" ? this.model.showAccepted = true : this.model.showAccepted = false;
                ev == "edited" ? this.model.showEdited = true : this.model.showEdited = false;
                ev == "rejected" ? this.model.showRejected = true : this.model.showRejected = false;

                this.model.set({
                    showViewed: ev == "viewed" ? true : false,
                    showAccepted: ev == "accepted" ? true : false,
                    showEdited: ev == "edited" ? true : false,
                    showRejected: ev == "rejected" ? true : false,
                });
            },

            _changeTitleStatus: function () {
                this.modalTitleModel.get('titleAccepted') && this.modalTitleModel.get('synopsisAccepted') ?
                    this.trigger('changeTitleStatus', true) : this.trigger('changeTitleStatus', false)
            },


            _changeShownStatus() {
                ModalTitleModel.getInstance().set('isShown', true)
            },

            _isModalOpen() {
                return ModalTitleModel.getInstance().get('isShown')
            },

            _mapSubtitles: function () {
                this.set({
                    subtitles: this.subtitlesBoxCollectionModel.map(function (m, i) {
                        return i;
                    }),
                });
            },

            _statsChanged: function (ev) {
                statsObj = {
                    subLength: this.subtitlesBoxCollectionModel.length,

                    accepted: this.subtitlesBoxCollectionModel.acceptedNum,
                    rejected: this.subtitlesBoxCollectionModel.conflictNum,
                    edited: this.subtitlesBoxCollectionModel.editedNum,
                    viewed: this.subtitlesBoxCollectionModel.viewedNum,
                    modified: this.subtitlesBoxCollectionModel.modifiedNum,

                    acceptedPerc: this.subtitlesBoxCollectionModel.acceptedPerc,
                    viewedPerc: this.subtitlesBoxCollectionModel.viewedPerc,
                    editedPerc: this.subtitlesBoxCollectionModel.editedPerc,
                    rejectedPerc: this.subtitlesBoxCollectionModel.conflictPerc,
                    modifiedPerc: this.subtitlesBoxCollectionModel.modifiedPerc,

                    showViewed: this.model.showViewed,
                    showAccepted: this.model.showAccepted,
                    showEdited: this.model.showEdited,
                    showRejected: this.model.showRejected,
                }
                this.set(statsObj)
                this.trigger('statsChanged', statsObj)
            },

            _onModelChanged: function () {
                this.set({
                    currentSubNumber: this.model.get('currentSubNumber'),
                    currentTime: this.model.currentTime,
                    typingBehavior: this.model.get('typingBehavior'),
                    videoLoaded: this.model.videoLoaded,
                    videoToPlay: this.model.videoToPlay,
                    reviewerActive: this.model.reviewerActive,

                });
            }
        });
        return VideoTempViewModel;

    });