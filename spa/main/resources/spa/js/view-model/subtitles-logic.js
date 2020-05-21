/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app}
 */

define(['model/subtitles-logic', 'model/subtitles-box-collection', 'model/video-temp', 'model/modal-template'],
    function (SubtitlesLogicModel, SubtitlesBoxCollection, VideoTemp, ModalTemplateModel) {
        var SubtitlesLogicViewModel = Backbone.Model.extend({

            defaults: {
                loaded: false
            },

            initialize: function (model, options) {
                this.set({
                    state: options.state,
                    jobid: options.jobid,
                });
                this.model = SubtitlesLogicModel.destroyInstance();
                this.model = SubtitlesLogicModel.getInstance();
                this.model.set({

                    'state': this.state,
                    'jobid': this.jobid,
                })
                this._onModelChanged();
                if (this.model.subtitlesCollection) {
                    this.listenTo(this.model.subtitlesCollection, 'sendToSave', this.stringifyOutput)
                    this.listenTo(this.model.subtitlesCollection, 'sendToReject', this.stringifyOutput)
                    this.listenTo(this.model.subtitlesCollection, 'sendToFinish', this.stringifyOutput)
                    this.listenTo(this.model.subtitlesCollection, 'finishSession', this.finishSession)
                    this.listenTo(this.model.subtitlesCollection, 'sendToRefuse', this.stringifyOutput)

                }
                this.modalModel = ModalTemplateModel.getInstance();
                this.listenTo(this.model, 'sync', this._onModelChanged);
                this.listenTo(this.model, 'video_path', this._videoPathChanged);
                this.modalModel.set('jobid', this.jobid);

            },

            _videoPathChanged: function (ev) {
                var videoTemp = VideoTemp.getInstance()
                videoTemp.videoToPlay = ev;
                videoTemp.set("video_path", ev);
                videoTemp.trigger("video_path", ev);
            },

            getSubtitlesCollection: function () {
                return this.model.subtitlesCollection;

            },

            getVideoModel: function () {
                return this.model.videoTemp;
            },

            _onModelChanged: function () {
                this.set({
                    loaded: this.model.isLoaded()
                });
                if (this.get('loaded')) {
                    if (this.model.get('instancecreated')) {
                        this.modalModel.set('jobid', this.jobid);
                        return [this.model.subtitlesCollection, this.model.videoTemp];
                    } else {
                        this.model.subtitlesCollection = new SubtitlesBoxCollection(null,
                            {
                                data: {
                                    original_text: this.model.get('original_text'),
                                    auto_text: this.model.get('auto_text'),
                                    translated_text: this.model.get('translated_text'),
                                    original_title: this.model.get('original_title'),
                                    auto_title: this.model.get('auto_title'),
                                    translated_title: this.model.get('translated_title'),
                                    original_synopsis: this.model.get('original_synopsis'),
                                    auto_synopsis: this.model.get('auto_synopsis'),
                                    translated_synopsis: this.model.get('translated_synopsis'),
                                    edited_percent_editor: this.model.get('edited_percent_editor'),
                                    viewed_percent_editor: this.model.get('viewed_percent_editor'),
                                    validated_percent_editor: this.model.get('validated_percent_editor'),
                                    edited_percent_reviewer: this.model.get('edited_percent_reviewer'),
                                    viewed_percent_reviewer: this.model.get('viewed_percent_reviewer'),
                                    validated_percent_reviewer: this.model.get('validated_percent_reviewer'),
                                    language_source: this.model.get('language_source'),
                                    language_target: this.model.get('language_target'),
                                },

                                status: this.model.get('status'),
                                job_id: this.model.get('job_id'),
                            });
                        this.model.set('instancecreated', true);

                        this.model.videoTemp = new VideoTemp(null, this.model);

                        return [this.model.subtitlesCollection, this.model.videoTemp];
                    }
                }

            },

            onSuccess: function (response, textStatus, isReject, ignoreSaveModal) {
                switch (response.code) {
                    case 200:
                        if (!this.finishAction) {
                            if (!this.modalModel.get('resetmodal')) {
                                this.modalModel.set({
                                    modaltitle: 'Success',
                                    savemodal: true,
                                    finishmodal: false,
                                    helpmodal: false,
                                    rejectmodal: false,
                                    returnmodal: false,
                                    dataAction: true,
                                    errorModal: false,
                                    successModal: true,
                                    resetmodal: false,
                                    errorText: "Data saved"
                                })
                                if (isReject) {
                                    this.modalModel.set({
                                        successReject: true,
                                        savemodal: false,
                                        finishmodal: false,
                                        helpmodal: false,
                                        rejectmodal: false,
                                        returnmodal: false,
                                        dataAction: true,
                                        errorModal: false,
                                        successModal: true,
                                        resetmodal: false,
                                        errorText: "Task rejected"
                                    })
                                }
                            } else {
                                setTimeout(_.bind(function () {
                                    window.parent.postMessage("action:exit", "*");
                                }, this), 1000);
                            }
                            SubtitlesBoxCollection.getInstance().trigger('saveSuccessfully');
                        } else {
                            this.modalModel.set({
                                modaltitle: 'Success Finishing the task',
                                savemodal: false,
                                finishmodal: false,
                                helpmodal: false,
                                rejectmodal: false,
                                returnmodal: false,
                                dataAction: true,
                                errorModal: false,
                                successModal: true,
                                successReject: false,
                                resetmodal: false,
                                errorText: "The data is correctly saved, you may now return to the Crowdsourcing platform"
                            })
                        }
                        break;
                    default:
                        alert('Success')
                        break;
                }
                if (!ignoreSaveModal) {
                    this.modalModel.set('isShown', true);
                    this.model.trigger('showModal');
                }

            },
            onError: function (response, textStatus, message) {
                switch (response.status) {
                    case 400:
                        this.modalModel.set({
                            modaltitle: "Bad request",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            resetmodal: false,
                            errorText: "The information provided by the url and the job you are working don't match" + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    case 401:
                        this.modalModel.set({
                            modaltitle: "Unauthorized",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            resetmodal: false,
                            errorText: "Unauthorized Access on retrieving the Job, return to the CrowdSourcing Platform" + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    case 404:
                        this.modalModel.set({
                            modaltitle: "Not Found",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            resetmodal: false,
                            errorText: "The job in which you are trying to save doesn't exist" + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    case 500:
                        this.modalModel.set({
                            modaltitle: "Error ocurred on the server",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            resetmodal: false,
                            errorText: "Internal Server Error, Try again later" + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                    default:
                        this.modalModel.set({
                            modaltitle: "Unknown Error",
                            savemodal: false,
                            finishmodal: false,
                            helpmodal: false,
                            rejectmodal: false,
                            returnmodal: false,
                            dataAction: true,
                            errorModal: true,
                            successModal: false,
                            resetmodal: false,
                            errorText: "Unknown error, Try again later" + "</br></br>Error " + JSON.parse(response.responseText).code + ":  " + JSON.parse(response.responseText).description,
                        })
                        break;
                }
                this.modalModel.set('isShown', true);
                this.model.trigger('showModal');

            },

            finishSession: function () {
                this.modalModel.set({
                    modaltitle: 'Session finished',
                    savemodal: false,
                    finishmodal: false,
                    helpmodal: false,
                    rejectmodal: false,
                    returnmodal: false,
                    dataAction: true,
                    errorModal: false,
                    successModal: true,
                    successReject: false,
                    resetmodal: false,
                    errorText: ""
                })
                this.modalModel.set('isShown', true);
                this.model.trigger('showModal');

            },

            savePUT: function (jsonstring, urlpath, isReject, ignoreSaveModal) {
                // Build the post string from an object                    
                onSuccess = _.bind(function (response, textStatus, message) {
                    this.onSuccess(response, textStatus, isReject, ignoreSaveModal)
                }, this);
                onError = _.bind(function (response, textStatus, message) {
                    this.onError(response, textStatus, message)
                }, this);

                $.ajax({ //Request settings
                })
            },

        });
        return SubtitlesLogicViewModel;

    });