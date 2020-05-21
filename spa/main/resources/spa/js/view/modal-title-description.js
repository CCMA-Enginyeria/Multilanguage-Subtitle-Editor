/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 */

define(['view-model/modal-title-description', './super/vm-view'],
    function (ModalTitleDescriptionViewModel, VMView) {
        ModulJitpub.add({

            name: 'modal-title-description',
            className: 'modal-title-description-view',
            templateName: 'modal-title-description',
            ViewModel: ModalTitleDescriptionViewModel,

            initialize: function () {
                this.BaseModul.prototype.initialize.apply(this, arguments);

            },

            afterRender: function () {
                this.BaseModul.prototype.afterRender.apply(this, arguments);
                if (this.$el[0].getElementsByClassName('title-modified-action')[0]) {
                    this._SetCaretAtEnd(this.$el[0].getElementsByClassName('title-modified-action')[0])
                }

                if (this.$el[0].getElementsByClassName('synopsis-modified-action')[0]) {
                    this._SetCaretAtEnd(this.$el[0].getElementsByClassName('synopsis-modified-action')[0])
                }

            },

            getViewModel: function () {
                return new this.ViewModel(null, {
                    'state': this.$el.data('state'),
                });
            },

            vmEvents: {
                'change': 'render',

            },

            events: {
                'click .change-synopsis-action': 'onClickSynopsis',
                'click .change-title-action': 'onClickTitle',
                'change .title-modified-action': 'onTitleModified',
                'input .title-modified-action': 'titleOnCourse',
                'change .synopsis-modified-action': 'onSynopsisModified',
                'input .synopsis-modified-action': 'synopsisOnCourse',
                'click .reject-title-action': 'onRejectTitle',
                'click .reject-synopsis-action': 'onRejectSynopsis',
                'click .undo-title-action': 'onClickUndoTitle',
                'click .undo-synopsis-action': 'onClickUndoSynopsis',
                'click .accept-title-action': 'onAcceptTitle',
                'click .accept-synopsis-action': 'onAcceptSynopsis',
                'click .close-action': 'closeTitleModal',
                'click .click-outside-action': 'removeInputFocus',
                'click .add-credits-action': 'addCredits',
                'shown.bs.modal': 'onShown',
                'hidden.bs.modal': 'onHidden'
            },

            onShown: function () {
                this.viewModel.notifyModalVisibility(true);
            },

            onHidden: function () {
                this.viewModel.notifyModalVisibility(false);
            },

            addCredits: function () {
                this.viewModel.addCredits();
            },

            titleOnCourse: function () {
                this.viewModel._setEditionOnCourse(true);
            },
            synopsisOnCourse: function () {
                this.viewModel._setEditionOnCourse(false);
            },

            removeInputFocus: function () {
                this.viewModel.removeInputFocus();
            },

            closeTitleModal: function () {
                this.viewModel._closeTitleModal();
            },

            onRejectTitle: function (e) {
                e.preventDefault();
                this.viewModel.onRejectTitle();
            },
            onRejectSynopsis: function (e) {
                e.preventDefault();
                this.viewModel.onRejectSynopsis();
            },

            onAcceptTitle: function (e) {
                e.preventDefault();
                this.viewModel.onAcceptTitle();
            },
            onAcceptSynopsis: function (e) {
                e.preventDefault();
                this.viewModel.onAcceptSynopsis();
            },

            onClickUndoTitle: function (e) {
                e.preventDefault();
                this.viewModel.onClickUndoTitle();
            },

            onTitleModified: function (ev) {
                this.viewModel.onTitleModified($(ev.currentTarget)[0].value, false);
            },

            onClickUndoSynopsis: function (e) {
                e.preventDefault();
                this.viewModel.onClickUndoSynopsis();
            },


            onSynopsisModified: function (ev) {
                this.viewModel.onSynopsisModified($(ev.currentTarget)[0].value, false);
            },

            onClickTitle: function (ev) {
                this.viewModel.onClickTitle();
            },

            onClickSynopsis: function (ev) {
                this.viewModel.onClickSynopsis();
            },

            _SetCaretAtEnd: function (elem) {
                var elemLen = (elem.value || elem.innerHTML).length;
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


        }, VMView);
    });