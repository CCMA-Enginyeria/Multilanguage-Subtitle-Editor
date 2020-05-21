/**
 * @module view/spa-app
 * @requires module:view-model/spa-app
 * @requires module:view/super/vm-view
 * @see {@link module:view/header} 
 * @see {@link module:view/container} 
 * @see {@link module:view/login-container} 
 * @see {@link module:view/generic-modal-container} 
 */

define(['view-model/video-temp', './super/vm-view', 'SubtitlesPlugin', 'Cuepoints'],
    function (VideoTempViewModel, VMView, SubtitlesPlugin, Cuepoints) {
        ModulJitpub.add({

            name: 'video-temp',
            className: 'video-temp-view',
            templateName: 'video-temp',
            ViewModel: VideoTempViewModel,

            initialize: function () {
                this.BaseModul.prototype.initialize.apply(this, arguments);
                this.contentRendered = false;
                this.titleStatus = true;
                this._onKeyDown = _.bind(this._onKeyDown, this);
                this._onKeyUp = _.bind(this._onKeyUp, this);
                this.keyEventFired = false;
            },

            afterRender: function () {
                this.BaseModul.prototype.afterRender.apply(this, arguments);
                if (!videojs.getPlayers()['my-video']) {
                    this.myPlayer = videojs('#my-video', {
                        controlBar: {
                            fullscreenToggle: false,
                            sources: [{ "type": "video/mp4", "src": this.viewModel.get('videoToPlay'), }],
                        },
                        sources: [{ "type": "video/mp4", "src": this.viewModel.get('videoToPlay') }],
                        playerOptions: {
                            sources: [{ "type": "video/mp4", "src": this.viewModel.get('videoToPlay'), }],
                        },
                    });
                } else {
                    this.myPlayer = videojs.getPlayers()['my-video']
                }

                this.myPlayer.reset();
                this.myPlayer.on('seeking', _.bind(this.onGoToBox, this));
                this.myPlayer.on('timeupdate', _.bind(this.onTimeUpdate, this));
                this.myPlayer.on('pause', _.bind(this.isPlaying, this));
                this.myPlayer.on('play', _.bind(this.isPlaying, this));
                $(window).on('keydown', this._onKeyDown);
                $(window).on('keyup', this._onKeyUp);
                this.contentRendered = true;
                this.typingBehavior = true;



                this.loadSubtitles();
                this.viewModel._statsChanged()
                this.viewModel.startListening();
                this.viewModel._changeTitleStatus();

            },

            beforeRender: function () {
                if (videojs.getPlayers()['my-video']) {
                    videojs.getPlayers()['my-video'].dispose();
                }
                this.BaseModul.prototype.beforeRender.apply(this, arguments);
            },

            destroy: function () {
                $(window).off('keydown', this._onKeyDown);
                $(window).off('keydown', this._onKeyUp);
                this.BaseModul.prototype.destroy.apply(this, arguments);
            },

            getViewModel: function () {
                return new this.ViewModel(null, {
                    'state': this.$el.data('state')
                });
            },

            events: {
                'videoTimeChanged .video-js': 'onVideoTimeChanged',
                'click .get-help-action': 'getHelpModal',
                'click .edit-action': 'changeShownStatus',
                'click .refresh-video-action': 'refreshVideo',
                'mouseover .viewed': 'onMouseViewedStats',
                'mouseover .accepted': 'onMouseAcceptedStats',
                'mouseover .edited': 'onMouseEditedStats',
                'mouseover .rejected': 'onMouseRejectedStats',
            },

            changeShownStatus: function () {
                this.viewModel._changeShownStatus()
            },

            isPlaying: function () {
                this.viewModel.isPlaying(!this.myPlayer.paused());
            },

            getHelpModal: function () {
                this.viewModel.getHelpModal();
            },
            onVideoTimeChanged: function (ev, data) {
                this.viewModel.onSeeking(data.ms);
                this.myPlayer.currentTime(data.ms);
            },

            onGoToBox: function (ev) {
                this.subtitles.clearAndRefreshNoTimeout();
            },

            onTimeUpdate: function (ev) {
                this.viewModel.onSeeking(this.myPlayer.currentTime());
                if (this.cuepoints) {
                    this.cuepoints.checkCuepoints(this.myPlayer.currentTime() * 1000);
                }
            },

            loadSubtitles: function () {
                if (!this.contentRendered) {
                    return;
                }
                this.initializeSubtitlesPlugin();
            },
            refreshVideo: function () {
                this.viewModel.getVideoUrl();
            },
            onMouseViewedStats: function () {
                this.viewModel.setSelectedStats('viewed');
            },
            onMouseAcceptedStats: function () {
                this.viewModel.setSelectedStats('accepted');
            },
            onMouseEditedStats: function () {
                this.viewModel.setSelectedStats('edited');
            },
            onMouseRejectedStats: function () {
                this.viewModel.setSelectedStats('rejected');
            },

            vmEvents: {
                'change:subtitlesId': 'loadSubtitles',
                'change:currentSubNumber': '_updateSubtitleNumber',
                'change:typingBehavior': 'changeViewTypingBehavior',
                'statsChanged': 'renderStats',
                'changeTitleStatus': 'changeTitleStatus',
                'url_refreshed': 'renderVideo',
            },

            renderVideo: function (url) {
                if (this.myPlayer) {
                    this.myPlayer.src(url);
                };
            },

            changeTitleStatus: function (ev) {
                ev ? $(this.$el[0].getElementsByClassName('R-edit-title-description')[0]).removeClass('redtitle') :
                    $(this.$el[0].getElementsByClassName('R-edit-title-description')[0]).addClass('redtitle')
            },


            changeViewTypingBehavior: function (ev) {
                this.typingBehavior = ev.get('typingBehavior');
            },

            renderStats: function (ev) {

                if (ev.showViewed) {
                    document.getElementById('statsTitle').innerHTML = "Viewed";
                    document.getElementById('statsPercBar').innerHTML = ev.viewedPerc + "%";
                    document.getElementById('statsBar').style.width = ev.viewedPerc + "%";
                    document.getElementById('statsBar').classList.remove('bg-primary', 'bg-success', 'bg-danger');
                    document.getElementById('statsBar').classList.add('bg-secondary');
                }
                if (ev.showAccepted) {
                    document.getElementById('statsTitle').innerHTML = "Accepted";
                    document.getElementById('statsPercBar').innerHTML = ev.acceptedPerc + "%";
                    document.getElementById('statsBar').style.width = ev.acceptedPerc + "%";
                    document.getElementById('statsBar').classList.remove('bg-primary', 'bg-secondary', 'bg-danger');
                    document.getElementById('statsBar').classList.add('bg-success');
                }
                if (ev.showEdited) {
                    document.getElementById('statsTitle').innerHTML = "Edited";
                    document.getElementById('statsBar').classList.remove('bg-secondary', 'bg-success', 'bg-danger');
                    document.getElementById('statsBar').classList.add('bg-primary');

                    if (this.viewModel.isReviewer()) {
                        document.getElementById('statsPercBar').innerHTML = ev.modifiedPerc + "%";
                        document.getElementById('statsBar').style.width = ev.modifiedPerc + "%";
                    } else {
                        document.getElementById('statsPercBar').innerHTML = ev.editedPerc + "%";
                        document.getElementById('statsBar').style.width = ev.editedPerc + "%";
                    }
                }
                if (ev.showRejected) {
                    document.getElementById('statsTitle').innerHTML = "Rejected";
                    document.getElementById('statsPercBar').innerHTML = ev.rejectedPerc + "%";
                    document.getElementById('statsBar').style.width = ev.rejectedPerc + "%";
                    document.getElementById('statsBar').classList.remove('bg-primary', 'bg-success', 'bg-secondary');
                    document.getElementById('statsBar').classList.add('bg-danger');
                }

                document.getElementById('subtitlesLength').innerHTML = ev.subLength;
                document.getElementById('acceptedNum').innerHTML = ev.accepted;
                if (this.viewModel.isReviewer()) {
                    document.getElementById('rejectedNum').innerHTML = ev.rejected;
                    document.getElementById('editedNum').innerHTML = ev.modified;
                } else {
                    document.getElementById('viewedNum').innerHTML = ev.viewed;
                    document.getElementById('editedNum').innerHTML = ev.edited;
                }

            },

            _updateSubtitleNumber: function (ev) {
                document.getElementById("videoSubCount").innerHTML = ev.get('currentSubNumber');
            },
            _onKeyDown: function (ev) {
                if (!this._isModalOpen()) {
                    if (ev.which == 32 && ev.ctrlKey) {
                        if (!this.keyEventFired) {
                            if (this.myPlayer.paused()) this.myPlayer.play();
                            else this.myPlayer.pause()
                            this.keyEventFired = true;
                        }
                    } else if (this.typingBehavior) {
                        if (!(ev.which == 27) && !(ev.which == 13) && !(ev.which == 32) && !(ev.which == 67) && !(ev.ctrlKey)) {
                            this.myPlayer.pause();
                        }
                    }
                }
            },


            _isModalOpen: function () {
                return this.viewModel._isModalOpen();
            },

            _onKeyUp: function () {
                this.keyEventFired = false;
            },

            initializeSubtitlesPlugin: function () {
                if (!this.cuepoints) this.cuepoints = new Cuepoints();
                if (this.subtitles) this.subtitles.unload();
                this.subtitles = new SubtitlesPlugin(this.$el.find('#subtitles').get(0));
                //Loads subtitlesrenderer from url and inserts in Cuepoints
                this.subtitles.loadXML(this.cuepoints, this.viewModel.getSubtitlesSource());
                this.cuepoints.checkCuepoints(this.myPlayer.currentTime() * 1000);
            },
        }, VMView);
    });