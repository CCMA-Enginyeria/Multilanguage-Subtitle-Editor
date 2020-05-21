/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header}
 * @see {@link module:view/container}
 * @see {@link module:view/login-container}
 * @see {@link module:view/generic-modal-container}
 */

define(['view-model/tab-logic', './super/vm-view'],
    function (TabLogicViewModel, VMView) {
        ModulJitpub.add({

            name: 'tab-logic',
            className: 'tab-logic-view',
            templateName: 'tab-logic',
            ViewModel: TabLogicViewModel,

            initialize: function () {
                this.BaseModul.prototype.initialize.apply(this, arguments);

            },

            getViewModel: function () {
                var queryParams = this.$el.data('queryparams').split('&')
                for (i = 0; i < queryParams.length; i++) {
                    if (queryParams[i].match('userid')) {
                        var userid = queryParams[i].substring(queryParams[i].match('=').index + 1)
                    } else if (queryParams[i].match('token')) {
                        var token = queryParams[i].substring(queryParams[i].match('=').index + 1)
                    } else if (queryParams[i].match('job')) {
                        var job = queryParams[i].substring(queryParams[i].match('=').index + 1)
                    } else if (queryParams[i].match('editorid')) {
                        var editorid = queryParams[i].substring(queryParams[i].match('=').index + 1)
                    }
                }
                return new this.ViewModel(null, {
                    'state': this.$el.data('state'),
                    'userid': userid,
                    'token': token,
                    'job': job,
                    'editorid': editorid,
                });
            },
            afterRender: function () {
                this.BaseModul.prototype.afterRender.apply(this, arguments);
                this.viewModel.startListening();

            },

            vmEvents: {
                'change': 'render',
                'enableFinish': 'enableFinish',
                'showModal': 'showModal'
            },

            showModal: function () {
                if (document.getElementById('hiddenModalButton')) {
                    document.getElementById('hiddenModalButton').click();
                } else {
                    setTimeout(function () {
                        document.getElementById('hiddenModalButton').click();
                    }, 1000);
                }
            },

            enableFinish: function (ev) {

                if (document.getElementById('finishButton')) {
                    if (ev) {
                        document.getElementById('finishButton').removeAttribute('disabled');
                        $('[data-toggle="tooltip"]').tooltip('disable');
                    } else {
                        document.getElementById('finishButton').setAttribute('disabled', true);
                        $('[data-toggle="tooltip"]').tooltip('enable');
                    }
                }
            },

            events: {
                'click .save-progress-action': 'onSaveProgress',
                'click .reject-progress-action': 'onRejectProgress',
                'click .finish-task-action': 'onFinishTask',
                'click button.return-to-crwdplat-action': 'onReturnToCrwdSourcing',
                'click .typing-behaviour-action': 'onChangeTypingBehavior',
                'click .change-focus-behavior-action': 'onChangeFocusBehavior',
                'click .subtitle-box-view': 'startListening',
                'click .reset-task-action': 'onResetTask',
            },

            onFinishTask: function () {
                if (!document.getElementById('finishButton').getAttribute('disabled')) this.viewModel.onFinishTask();
            },

            onSaveProgress: function () {
                this.viewModel.onSaveProgress();
            },
            onRejectProgress: function () {
                this.viewModel.onRejectProgress();
            },

            onResetTask: function () {
                this.viewModel.onResetTask();
            },

            onChangeTypingBehavior: function () {
                this.viewModel.onChangeTypingBehavior();
            },

            onChangeFocusBehavior: function () {
                this.viewModel.onChangeFocusBehavior();
            },

            onReturnToCrwdSourcing: function (e) {
                e.preventDefault();
                this.viewModel.checkProgressToClose();
            },

        }, VMView);
    });