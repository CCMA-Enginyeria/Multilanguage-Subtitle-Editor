/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app} 
 */

define(['model/modal-template', 'model/subtitles-box-collection'],
    function (ModalTemplateModel, SubtitleBoxCollection) {
        var ModalTemplateViewModel = Backbone.Model.extend({

            defaults: {
            },

            initialize: function () {
                this.model = ModalTemplateModel.getInstance();
                this.listenTo(this.model, 'change', this._onModelChange)

                this.subtitleBoxCollection = SubtitleBoxCollection.getInstance();
                this.listenTo(this.subtitleBoxCollection.modalTitleTemplateModel, 'change:state', this._setReviewer);
            },

            onClickAccept: function (ev) {
                if (this.get('returnmodal')) {
                    var subBoxColl = SubtitleBoxCollection.getInstance()
                    document.getElementById("loader").style.display = "block";
                    subBoxColl.sendToSave();
                    document.getElementById("loader").style.display = "none";
                    this.exitIframe();
                } else if (this.get('savemodal')) {
                    var tempInstance = SubtitleBoxCollection.getInstance()
                    tempInstance.sendToSave();
                } else if (this.get('finishmodal')) {
                    var tempInstance = SubtitleBoxCollection.getInstance()
                    tempInstance.sendToFinish();
                } else if (this.get('rejectmodal')) {
                    var tempInstance = SubtitleBoxCollection.getInstance()
                    tempInstance.silentSave();
                    this.model.set('isShown', false);
                    tempInstance.once('saveSuccessfully', _.bind(function () {
                        tempInstance.sendToReject(ev);
                    }, this));
                    return;
                } else if (this.get('resetmodal')) {
                    if (ev.currentTarget.innerText == "Suitable") {
                        this.approveTask();
                        this.sendToReset();
                        setTimeout(_.bind(function () {
                            this.exitIframe();
                        }, this), 1300);
                    } else if (ev.currentTarget.innerText == "Not suitable") {
                        var tempInstance = SubtitleBoxCollection.getInstance();
                        this.suspendTask();
                        tempInstance.sendToRefuse();
                    };
                } else if (this.get('errorModal')) {
                    this.exitIframe();
                }

                this.model.set('isShown', false)
            },

            onClickDiscard: function () {
                this.model.set('isShown', false)
                this.exitIframe();
            },

            onClickCancel: function (ev) {
                this.model.set('isShown', false)
                if (this.get('successModal')) {
                    var tempInstance = SubtitleBoxCollection.getInstance()
                    tempInstance.finishSession();
                    this.exitIframe();
                }
            },

            onClickSave: function () {
                var tempInstance = SubtitleBoxCollection.getInstance()
                tempInstance.silentSave();
                setTimeout(_.bind(function () {
                    this.exitIframe();
                }, this), 1000);
            },

            exitIframe: function () {
                window.parent.postMessage("action:exit", "*");
            },

            _setReviewer: function (ev) {
                if (ev.get('state') == "Reviewer") {
                    this.model.set("reviewerActive", true);
                } else {
                    this.model.set("reviewerActive", false);
                }
            },

            notifyModalVisibility: function (visibilty) {
                this.model.set('isShown', visibilty);
            },

            onEvaluateError: function (response, textStatus) {
                if (textStatus.responseText) {
                    alert(JSON.parse(textStatus.responseText).code + ":  " + JSON.parse(textStatus.responseText).description +
                        "\n\nThere was an error reseting the job\n You can try again refreshing this page.");
                } else {
                    alert("Evaluate Error: " + textStatus.status + ":  " + textStatus.statusText + "\n\nThere was an error evaluating the job\n You can try again refreshing this page.")
                }
            },

            onResetError: function (response, textStatus) {
                if (textStatus.responseText) {
                    alert(JSON.parse(textStatus.responseText).code + ":  " + JSON.parse(textStatus.responseText).description +
                        "\n\nThere was an error reseting the job\n You can try again refreshing this page.");
                } else {
                    alert("Reset Error: " + textStatus.status + ":  " + textStatus.statusText + "\n\nThere was an error reseting the job\n You can try again refreshing this page.")
                }
            },



            approveTask: function () {

                var subBoxColl = SubtitleBoxCollection.getInstance();

                var approve_settings = ({
                    //Request settings
                });

                this.model.fetch(approve_settings);
            },

            suspendTask: function () {

                var subBoxColl = SubtitleBoxCollection.getInstance();

                var suspend_settings = ({
                    //Request settings
                });

                this.model.fetch(suspend_settings);

            },

            sendToReset: function () {

                var reset_settings = ({
                    //Request settings
                });
                this.model.fetch(reset_settings);
            },


            _onModelChange: function () {
                this.set({
                    modaltitle: this.model.get('modaltitle'),
                    helpmodal: this.model.get('helpmodal'),
                    savemodal: this.model.get('savemodal'),
                    finishmodal: this.model.get('finishmodal'),
                    returnmodal: this.model.get('returnmodal'),
                    rejectmodal: this.model.get('rejectmodal'),
                    dataAction: this.model.get('dataAction'),
                    errorModal: this.model.get('errorModal'),
                    successModal: this.model.get('successModal'),
                    errorText: this.model.get('errorText'),
                    successReject: this.model.get('successReject'),
                    isShown: this.model.get('isShown'),
                    reviewerActive: this.model.get('reviewerActive'),
                    resetmodal: this.model.get('resetmodal'),
                })
            },

            _closeModal: function () {
                this.model.set('isShown', false);
            },


        });
        return ModalTemplateViewModel;

    });