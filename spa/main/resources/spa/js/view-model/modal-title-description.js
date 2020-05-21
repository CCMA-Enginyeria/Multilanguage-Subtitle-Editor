/**
 * @module view-model/spa-app
 * @requires module:router
 * @requires module:global
 * @see {@link module:view/spa-app}
 */

define(['model/modal-title-description', 'model/subtitles-box-collection'],
    function (ModalTitleDescriptionModel, SubtitleBoxCollection, TabLogicModel) {
        var ModalTitleDescriptionViewModel = Backbone.Model.extend({

            defaults: {
                originalSynopsis: "No Original Synopsis loaded",
                originalTitle: "No Title loaded",
                autoSynopsis: "No Automated Synopsis loaded",
                autoTitle: "No Automated Title loaded",
                translatedSynopsis: "No Translated Synopsis loaded",
                translatedTitle: "No Translated Title loaded",
                synopsisEdited: false,
                titleEdited: false,
                synopsisReviewerEdited: false,
                titleReviewerEdited: false,
                synopsisAccepted: false,
                titleAccepted: false,
                synopsisConflict: false,
                titleconflict: false,
                isShown: false,
                synopsisOnCourse: false,
                editedSynopsisUndo: false,
                titleOnCourse: false,
                editedTitleUndo: false,
                isReviewerActive: false,
                isRTL: false,
                creditsAdded: true,
            },


            initialize: function () {
                this.model = ModalTitleDescriptionModel.getInstance();
                this.listenTo(this.model, 'change', this._onModelChanged);
            },

            onTitleModified: function (newTitle, isUndo) {
                var changeObj = {};
                changeObj['translatedTitle'] = newTitle;
                this.set('titleClicked', false);
                if (newTitle.trim() == this.model.get('autoTitle').trim()) {
                    if (isUndo) {
                        changeObj['titleReviewerEdited'] = false;
                        changeObj['titleEdited'] = false;
                        changeObj['titleConflict'] = false;
                        changeObj['titleOnCourse'] = false;
                        if (!this.get('isReviewerActive')) changeObj['titleAccepted'] = false;
                    } else this.get('isReviewerActive') ? changeObj['titleReviewerEdited'] = false : changeObj['titleEdited'] = false;
                } else {
                    var newTitleCondition = (newTitle.trim() == this.get('translatedTitle').trim());
                    if (this.get('isReviewerActive')) {
                        if (!newTitleCondition) {
                            changeObj['titleReviewerEdited'] = true;
                            changeObj['titleAccepted'] = true;
                        }
                    } else {
                        if (!newTitleCondition) {
                            changeObj['titleEdited'] = true;
                            changeObj['titleAccepted'] = false;
                        }
                    }
                    changeObj['titleConflict'] = false;
                }
                this.model.set(changeObj);

            },
            onClickUndoTitle: function () {
                this.onTitleModified(this.model.get('autoTitle'), true)
            },

            onClickUndoSynopsis: function () {
                this.onSynopsisModified(this.model.get('autoSynopsis'), true)
            },


            onSynopsisModified: function (newSynopsis, isUndo) {
                var changeObj = {
                };
                changeObj['translatedSynopsis'] = newSynopsis;
                this.set('synopsisClicked', false)
                if (newSynopsis.trim() == this.model.get('autoSynopsis').trim()) {
                    if (isUndo) {
                        changeObj['synopsisReviewerEdited'] = false;
                        changeObj['synopsisEdited'] = false;
                        changeObj['synopsisConflict'] = false;
                        changeObj['synopsisOnCourse'] = false;
                        if (!this.get('isReviewerActive')) changeObj['synopsisAccepted'] = false;
                    } else this.get('isReviewerActive') ? changeObj['synopsisReviewerEdited'] = false : changeObj['synopsisEdited'] = false;
                } else {
                    var newSynopsisCondition = (newSynopsis.trim() == this.get('translatedSynopsis').trim());
                    if (this.get('isReviewerActive')) {
                        if (!newSynopsisCondition) {
                            changeObj['synopsisReviewerEdited'] = true
                            changeObj['synopsisAccepted'] = true;
                            changeObj['synopsisConflict'] = false;

                        }
                    } else {
                        if (!newSynopsisCondition) {
                            changeObj['synopsisEdited'] = true;
                            changeObj['synopsisAccepted'] = false;
                        }
                    }
                }
                this.model.set(changeObj);
                this.model.set({
                    editionOnCourse: true
                }, {
                    silent: true
                })
                this.set({
                    editionOnCourse: true
                })

            },

            removeInputFocus: function () {
                setTimeout(_.bind(function () {
                    if (!this.inputClicked) {
                        this.set({
                            synopsisClicked: false,
                            titleClicked: false,
                        })
                    } else this.inputClicked = false;
                }, this), 0)
            },

            onClickSynopsis: function () {
                this.set({
                    synopsisClicked: true,
                    titleClicked: false,
                })
                this.inputClicked = true
            },

            onClickTitle: function () {
                this.set({
                    titleClicked: true,
                    synopsisClicked: false,

                })
                this.inputClicked = true
            },

            onAcceptTitle: function () {
                this.model.set({
                    titleAccepted: !this.model.get('titleAccepted'),
                    titleConflict: false,
                    titleOnCourse: false,
                })
                this.model.get('titleAccepted') ? this.trigger('titleAccepted', true) : this.trigger('titleAccepted', false)
            },

            onAcceptSynopsis: function () {
                this.model.set({
                    synopsisAccepted: !this.model.get('synopsisAccepted'),
                    synopsisConflict: false,
                    synopsisOnCourse: false,
                })
                this.model.get('synopsisAccepted') ? this.trigger('synopsisAccepted', true) : this.trigger('synopsisAccepted', false)
            },

            onRejectTitle: function () {
                this.model.set({
                    titleConflict: true,
                    titleAccepted: false,
                    titleOnCourse: false,
                })
            },

            onRejectSynopsis: function () {
                this.model.set({
                    synopsisConflict: true,
                    synopsisAccepted: false,
                    synopsisOnCourse: false,
                })
            },

            notifyModalVisibility: function (visibilty) {
                this.model.set('isShown', visibilty);
            },

            addCredits: function () {
                this.model.set("creditsAdded", !this.model.get("creditsAdded"));

                subBoxCol = SubtitleBoxCollection.getInstance();

                if (this.model.get("creditsAdded")) {
                    subBoxCol._addCredits();
                } else {
                    subBoxCol._removeCredits();

                }
            },

            _setEditionOnCourse(isTitle) {
                if (!this.get('isReviewerActive')) {
                    isTitle ? this.model.set({ titleOnCourse: true }, { silent: true, }) : this.model.set({ synopsisOnCourse: true }, { silent: true, });
                }
            },

            _closeTitleModal: function () {
                this.model.set('isShown', false);
            },

            _onModelChanged: function () {
                this.set({
                    originalSynopsis: this.model.get('originalSynopsis'),
                    autoSynopsis: this.model.get('autoSynopsis'),
                    translatedSynopsis: this.model.get('translatedSynopsis') || this.model.get('autoSynopsis'),
                    synopsisEdited: this.model.get('synopsisEdited'),
                    synopsisReviewerEdited: this.model.get('synopsisReviewerEdited'),
                    synopsisAccepted: this.model.get('synopsisAccepted'),
                    synopsisConflict: this.model.get('synopsisConflict'),
                    synopsisOnCourse: this.model.get('synopsisOnCourse'),
                    editedSynopsisUndo: this.model.get('synopsisEdited') || this.model.get('synopsisReviewerEdited'),

                    originalTitle: this.model.get('originalTitle'),
                    autoTitle: this.model.get('autoTitle'),
                    translatedTitle: this.model.get('translatedTitle') || this.model.get('autoTitle'),
                    titleEdited: this.model.get('titleEdited'),
                    titleReviewerEdited: this.model.get('titleReviewerEdited'),
                    titleAccepted: this.model.get('titleAccepted'),
                    titleConflict: this.model.get('titleConflict'),
                    titleOnCourse: this.model.get('titleOnCourse'),
                    editedTitleUndo: this.model.get('titleEdited') || this.model.get('titleReviewerEdited'),

                    isShown: this.model.get('isShown'),
                    isReviewerActive: this.model._isReviewerActive(),
                    isRTL: this.model.get('isRTL'),
                    creditsAdded: this.model.get('creditsAdded'),
                })
            }


        });
        return ModalTitleDescriptionViewModel;

    });