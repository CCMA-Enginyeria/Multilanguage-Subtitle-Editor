/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app}
 */

define(['model/tab-logic', 'model/subtitles-box-collection', 'model/modal-template', 'model/subtitles-logic', 'model/modal-title-description'],
    function (TabLogicModel, SubtitleBoxCollectionModel, ModalTemplateModel, SubtitlesLogicModel, ModalTitleModel) {
        var TabLogicViewModel = Backbone.Model.extend({

            defaults: {
                renderedpage: 'subtitles',
                state: '',
                userid: '',
                token: '',
                originalLanguage: 'No original Language defined',
                outputLanguage: 'No output Language defined',
            },

            initialize: function (model, options) {
                this.set({
                    state: options.state,
                    userid: options.userid,
                    token: options.token,
                    jobid: options.job,
                    editorid: options.editorid,
                });
                this.model = TabLogicModel.destroyInstance();
                this.model = TabLogicModel.getInstance();
                this.model.state = options.state;
                this.model.userid = options.userid;
                this.model.token = options.token;
                this.model.jobid = options.job;
                this.model.editorid = options.editorid;
                this.model.allAccepted = options.allAccepted;

                if (this.get('state') == "Editor") {
                    this.set('isEditor', true)
                } else if (this.get('state') == "Reviewer") {
                    this.set('isReviewer', true)
                }

                this._fetchLogin();

                this.listenTo(this.model, 'sync', this._onModelChanged);
                this.listenTo(this.model, 'error', this._onModelError);
                this.modalModel = ModalTemplateModel.getInstance();
                this.modalModel.jobid = options.job;
                this.modalModel.userid = options.userid;
                this.modalModel.editorid = options.editorid;
                this.subLogicM = SubtitlesLogicModel.getInstance();
                this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                ModalTitleModel.getInstance().set('state', options.state);
                this._onModelChanged();
                this.startListening();

            },


            triggerModal: function () {
                this.trigger('showModal');
            },

            triggerTutorialModal: function () {
                this.modalModel.set({
                    modaltitle: "Hello!",
                    savemodal: true,
                    finishmodal: false,
                    helpmodal: true,
                    rejectmodal: false,
                    returnmodal: false,
                    dataAction: true,
                    errorModal: false,
                    successModal: false,
                    isShown: true,
                    resetmodal: false,
                    errorText: "",
                })
                this.trigger('showModal');
            },

            onError: function (response, textStatus, message) {
                switch (response.status) {
                    case 400:
                        this.modalModel.set({
                            modaltitle: "Incorrect Job Requested",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            isShown: true,
                            resetmodal: false,
                            errorText: "There is no job specified or it is in incorrect format." + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    case 401:
                        this.modalModel.set({
                            modaltitle: 'Fetch job error',
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            isShown: true,
                            resetmodal: false,
                            errorText: "Unauthorized Access on retrieving the Job, return to the CrowdSourcing Platform." + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    case 404:
                        this.modalModel.set({
                            modaltitle: "Job ID or credential doesn't exist",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            isShown: true,
                            resetmodal: false,
                            errorText: "The job you are trying to access isn't accessible. Return to CrowdSourcing platform." + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    case 500:
                        this.modalModel.set({
                            modaltitle: "Internal Server Error",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            isShown: true,
                            resetmodal: false,
                            errorText: "Please return to Crowdsourcing Platform and try again later." + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    default:
                        this.modalModel.set({
                            modaltitle: "Unknown error",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            isShown: true,
                            resetmodal: false,
                            errorText: "Please return to Crowdsourcing Platform and try again later." + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                }
                this.trigger('showModal');
            },

            onChangeToSubtitles: function () {
                this.set('renderedpage', 'subtitles');
            },

            startListening: function () {
                this.subtitleBoxCollectionModel.length > 0 ? this.subtitleBoxCollectionModel : this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                this.subLogicM = SubtitlesLogicModel.getInstance();
                this.listenTo(this.subLogicM, 'showModal', this.triggerModal);
                this.listenTo(this.subtitleBoxCollectionModel, 'enableFinish', this.checkProgressToFinish)
            },

            onChangeTypingBehavior: function () {
                this.subtitleBoxCollectionModel.length > 0 ? this.subtitleBoxCollectionModel : this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                this.subtitleBoxCollectionModel.trigger('changeBehavior');
            },

            onChangeFocusBehavior: function () {
                this.subtitleBoxCollectionModel.length > 0 ? this.subtitleBoxCollectionModel : this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                this.subtitleBoxCollectionModel.trigger('changeFocusBehavior');
            },


            onSaveProgress: function () {
                this.subtitleBoxCollectionModel.length > 0 ? this.subtitleBoxCollectionModel : this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                this.subtitleBoxCollectionModel.sendToSave();

            },
            onFinishTask: function () {
                this.subtitleBoxCollectionModel.length > 0 ? this.subtitleBoxCollectionModel : this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                this.modalModel.set({
                    modaltitle: 'Are you sure you want to finish the task?',
                    savemodal: false,
                    finishmodal: true,
                    helpmodal: false,
                    rejectmodal: false,
                    returnmodal: false,
                    dataAction: true,
                    errorModal: false,
                    successModal: false,
                    resetmodal: false,
                    isShown: true,
                    errorText: ""
                })
                this.trigger('showModal');
            },

            onRejectProgress: function () {
                this.subtitleBoxCollectionModel.length > 0 ? this.subtitleBoxCollectionModel : this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                this.modalModel.set({
                    modaltitle: 'Rejecting the task',
                    savemodal: false,
                    finishmodal: false,
                    helpmodal: false,
                    rejectmodal: true,
                    returnmodal: false,
                    dataAction: true,
                    errorModal: false,
                    successModal: false,
                    isShown: true,
                    resetmodal: false,
                    errorText: "",
                })
                this.trigger('showModal');
            },

            onResetTask: function () {

                this.modalModel.set({
                    modaltitle: 'Evaluating the task',
                    savemodal: false,
                    finishmodal: false,
                    helpmodal: false,
                    rejectmodal: false,
                    returnmodal: false,
                    dataAction: true,
                    errorModal: false,
                    successModal: false,
                    resetmodal: true,
                    isShown: true,
                    errorText: ""
                })
                this.trigger('showModal');
            },

            checkProgressToFinish: function (ev) {
                ev ? this.trigger('enableFinish', true) : this.trigger('enableFinish', false);
            },

            checkProgressToClose: function (ev) {
                this.subtitleBoxCollectionModel.length > 0 ? this.subtitleBoxCollectionModel : this.subtitleBoxCollectionModel = SubtitleBoxCollectionModel.getInstance();
                this.modalmodel = ModalTemplateModel.getInstance();
                this.modalmodel.set({
                    modaltitle: 'Warning! You are leaving this site.',
                    savemodal: false,
                    finishmodal: false,
                    helpmodal: false,
                    rejectmodal: false,
                    returnmodal: true,
                    errorModal: false,
                    dataAction: true,
                    resetmodal: false,
                    successModal: false,
                    isShown: true,
                    errorText: "There are some unsaved changes, are you sure to discard them?"
                });
                this.trigger('showModal');

            },

            _onModelChanged: function () {
                this.set({
                    renderedpage: this.get('renderedpage'),
                })
                if (this.model.isLoaded()) {
                    this.set({
                        originalLanguage: this.model.originalLanguage,
                        outputLanguage: this.model.outputLanguage,
                    })
                }
            },

            _onModelError: function (model, response, request) {
                this.onError(response);
            },

            _setConfLevel: function (response, textStatus) {
                this.set('contentLoaded', true);
                if (textStatus.confidence_level.toLowerCase() == "low") {
                    this.set('enableReset', true);
                } else {
                    this.set('enableReset', false);
                }
            },

            _fetchLogin: function () {

                var login_settings = ({
                    //Request settings
                });
                this.model.fetch(login_settings);
            },

            _fetchJob: function () {
                var job_settings = ({
                    //Request settings
                });
                this.model.fetch(job_settings);
            },

            _fetchVideoPath: function () {

                var video_url_settings = ({
                    //Request settings
                });

                this.model.fetch(video_url_settings);
            }

        });
        return TabLogicViewModel;

    });