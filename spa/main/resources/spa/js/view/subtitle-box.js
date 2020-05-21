
/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header} 
 * @see {@link module:view/container} 
 * @see {@link module:view/login-container} 
 * @see {@link module:view/generic-modal-container} 
 */

define(['view-model/subtitle-box', './super/vm-view'],
    function (SubtitleBoxViewModel, VMView) {
        ModulJitpub.add({

            name: 'subtitle-box',
            className: 'subtitle-box-view',
            templateName: 'subtitle-box',
            ViewModel: SubtitleBoxViewModel,

            initialize: function () {
                this.BaseModul.prototype.initialize.apply(this, arguments);
                this.onKeyDown = _.bind(this.onKeyDown, this);
                this.onKeyUp = _.bind(this.onKeyUp, this);
                if (this.viewModel.get('lastWorked')) {
                    this.firsttime = true
                } else {
                    this.firsttime = false;
                }
                this.isPauseOnType = false;
                this.videorendered = false;
                this.firedKeyEvent = false;
                this.caretSecondLine = false;
            },

            destroy: function () {
                $(window).off('keydown', this.onKeyDown);
                $(window).off('keyup', this.onKeyUp);
                this.BaseModul.prototype.destroy.apply(this, arguments);
            },

            afterRender: function () {
                this.BaseModul.prototype.afterRender.apply(this, arguments);
                if (this.viewModel.get('focus')) {
                    this._handleSelectedInput();
                    $(window).on('keydown', this.onKeyDown);
                    $(window).on('keyup', this.onKeyUp);
                    if (this.firsttime) {
                        this.$el[0].scrollIntoView({ behavior: "auto", block: "center" });
                        this.firsttime = false;
                    } else {
                        this.$el[0].scrollIntoView({ behavior: "auto", block: "center" });
                    }
                } else {
                    $(window).off('keydown', this.onKeyDown);
                    $(window).off('keyup', this.onKeyUp);
                }
                if (videojs.getPlayers()['my-video'] && !this.videorendered) {
                    this.myPlayer = videojs.getPlayers()['my-video']
                    this.videorendered = true;
                }
            },

            vmEvents: {
                'change': 'fastRender',
            },

            fastRender: function () {
                return this.render();
            },

            events: {
                'click a.cancel-edition-action': 'onCancelEdition',
                'click a.prevent-default-action': 'preventDefaultAction',
                'click .accept-subtitlebox-action': 'onAcceptSubtitlebox',
                'click .on-click-box-action': 'onClickSubtitleBox',
                'click a.undo-proposed-action': 'onClickUndoProposed',
                'click a.reject-subtitle-action': 'onRejectSubtitle',
                'mousedown a.add-line-action': 'onAddLine',
                'mousedown a.remove-line-action': 'onRemoveLine',
                'input .proposed-modified-action': 'showCancelEdition',
                'click input.proposed-modified-action': 'onSelectInput',
                'change .proposed-modified-action': 'onProposedModified',
            },

            preventDefaultAction: function (e) {
                e.preventDefault();
            },

            showCancelEdition: function (ev) {
                this.$el[0].getElementsByClassName('close')[0].removeAttribute('hidden')
                if (this.$el[0].getElementsByClassName('proposed-modified-action')[1]) {
                    var Obj = {
                        newsubt2: this.$el[0].getElementsByClassName('proposed-modified-action')[1].value,
                        newsubt: this.$el[0].getElementsByClassName('proposed-modified-action')[0].value,
                    }
                } else {
                    var Obj = {
                        newsubt2: "",
                        newsubt: this.$el[0].getElementsByClassName('proposed-modified-action')[0].value
                    }
                }
                this.viewModel._setEditionOnCourseSilent(Obj);
            },

            onAddLine: function () {
                this.viewModel.onAddLine();
            },

            onRemoveLine: function () {
                this.viewModel.onRemoveLine();
            },

            onMouseOverUndo: function () {
                this.viewModel.onMouseOverToggle(true);
            },
            onMouseOutUndo: function () {
                this.viewModel.onMouseOverToggle(false);
            },
            onRejectSubtitle: function (e) {
                if (e) {
                    e.stopPropagation();
                }
                e.preventDefault();
                if (this.viewModel.isReviewerActive()) {
                    this.viewModel.onRejectSubtitle();
                }
            },

            onClickUndoProposed: function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.viewModel.onClickUndoProposed();
            },

            onProposedModified: function (ev) {
                if (!this.isCancelling && !this.isAccepting) {
                    if (this.$el[0].getElementsByClassName('proposed-modified-action')[1]) {
                        newsubt2 = this.$el[0].getElementsByClassName('proposed-modified-action')[1].innerText
                            || this.$el[0].getElementsByClassName('proposed-modified-action')[1].value
                    } else {
                        newsubt2 = "";
                    }
                    var ObjToChange = {
                        newsubt: this.$el[0].getElementsByClassName('proposed-modified-action')[0].innerText
                            || this.$el[0].getElementsByClassName('proposed-modified-action')[0].value,
                        newsubt2: newsubt2
                    }
                    this.viewModel.onProposedModified(ObjToChange, true, false, ev)
                } else {
                    this.isCancelling = false;
                    this.isAccepting = false;
                }
            },

            onAcceptSubtitlebox: function (ev) {
                this.isAccepting = true;

                if (this.$el[0].getElementsByClassName('proposed-modified-action')[1]) {
                    newsubt2 = this.$el[0].getElementsByClassName('proposed-modified-action')[1].value ||
                        this.$el[0].getElementsByClassName('proposed-modified-action')[1].textContent.trim();
                } else {
                    newsubt2 = "";
                }
                var ObjToChange = {
                    newsubt: this.$el[0].getElementsByClassName('proposed-modified-action')[0].value ||
                        this.$el[0].getElementsByClassName('proposed-modified-action')[0].textContent.trim(),
                    newsubt2: newsubt2
                }
                this.viewModel.onProposedModified(ObjToChange, false, false);
                this.viewModel.onAcceptSubtitlebox();
                this.isAccepting = false;
                if (ev) {
                    ev.stopPropagation();
                }
                if (this.viewModel.get('focus')) {
                    this.viewModel.focusNextBox();
                }

            },

            onClickSubtitleBox: function (ev) {

                var ms = this.viewModel._timeToMs(this.$el[0].getElementsByClassName('go-to-begin-action')[0].textContent)
                if (ms == 0) { ms = 0.01 };
                if (!this.myPlayer) {
                    if (videojs.getPlayers()['my-video'] && !this.videorendered) {
                        this.myPlayer = videojs.getPlayers()['my-video']
                        this.videorendered = true;
                    }
                }
                if (!(ms.toFixed(3) == this.myPlayer.currentTime())) {
                    videojs("my-video").ready(function () {
                        this.currentTime(ms.toFixed(3));
                    });
                }
                this.myPlayer.pause();
                this.viewModel.BoxClicked(ev);
            },

            onKeyDown: function (ev) {
                if (!this._isModalOpen()) {
                    if (!this.firedKeyEvent) {
                        if (ev.key == "Escape") {
                            this.onCancelEdition();
                        } else if (ev.key == "e" || ev.key == "E") {
                            this.onClickSubtitleBox();
                        }
                        else if (ev.key == "ArrowDown") {
                            this.viewModel.focusNextBox();
                        }
                        else if (ev.key == "ArrowUp") {
                            this.viewModel.focusPreviousBox();
                        }
                        else if (ev.key == "Enter") {
                            ev.preventDefault();
                            if (this.viewModel.isFocusedClick()) {
                                this.onProposedModified(ev);
                            } else {
                                this.onAcceptSubtitlebox(ev);
                            }
                        }
                        else if (ev.key == "Tab") {
                            if (ev.target.className == "proposed-modified-action ") {
                                this.onSelectInput(ev.target);
                            }
                        }
                        if (this._isReviewerActive()) {
                            if (ev.which == 67 && ev.ctrlKey) {
                                this.viewModel.onRejectSubtitle();
                            } else if (ev.which == 67 && !(this.$el[0].getElementsByClassName('proposed-modified-action')[0].type == "text")) {
                                this.viewModel.onRejectSubtitle();
                            }
                        } else {
                            if (this.isPauseOnType) {
                                videojs("my-video").ready(function () {
                                    this.myPlayer.pause();
                                });
                            }
                        }
                        this.firedKeyEvent = true;
                    }
                }
            },

            onKeyUp: function (ev) {
                this.firedKeyEvent = false;
            },

            onCancelEdition: function (e) {
                if (e) e.preventDefault();
                this.isCancelling = true;
                this.viewModel.onCancelEdition();
                setTimeout(_.bind(function () {
                    this.isCancelling = false
                }, this), 300)
            },

            onSelectInput: function (e) {
                if ($('input.proposed-modified-action')[0] == e.currentTarget) {
                    this.caretSecondLine = false;
                } else {
                    this.caretSecondLine = true;
                }
            },

            _isModalOpen: function () {
                return this.viewModel._isModalOpen();
            },

            _isReviewerActive() {
                return this.viewModel.isReviewerActive();
            },

            _handleSelectedInput: function () {

                if ($('input.proposed-modified-action').length == 2 && document.activeElement.value) {
                    if ($('input.proposed-modified-action')[0].value == document.activeElement.value) {
                        this._SetCaretAtEnd($('input.proposed-modified-action')[0]);
                    } else if ($('input.proposed-modified-action')[1].value == document.activeElement.value) {
                        this._SetCaretAtEnd($('input.proposed-modified-action')[1]);
                    }

                } else {
                    elem = this.$el[0].getElementsByClassName('proposed-modified-action');
                    if (elem.length) {
                        this.caretSecondLine ? this._SetCaretAtEnd(elem[1]) : this._SetCaretAtEnd(elem[0]);
                    } else {
                        this._SetCaretAtEnd(elem);
                    }
                };

            },
            _SetCaretAtEnd: function (elem) {
                var elemLen = (elem.value || elem.innerHTML).length;
                // For IE Only
                if (document.selection) {
                    // Set focus
                    elem.focus();
                    // Use IE Ranges
                    var oSel = document.selection.createRange();
                    // Reset position to 0 & then set at end
                    oSel.moveStart('character', -elemLen);
                    oSel.moveStart('character', elemLen);
                    oSel.moveEnd('character', 0);
                    oSel.select();
                }
                else if (elem.selectionStart || elem.selectionStart == '0') {
                    elem.selectionStart = elemLen;
                    elem.selectionEnd = elemLen;
                    elem.focus();
                }
            },

            _replaceAll: function (str, find, replace) {
                if (!(str == null)) {
                    return str.replace(new RegExp(find, 'g'), replace);
                };
            },
        }, VMView);
    });