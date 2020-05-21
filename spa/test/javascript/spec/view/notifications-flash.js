require(['sinon'], function(sinon) {
    /*
     * -----------------------------------------------
     * Configuració bàsica
     * -----------------------------------------------
     */
    var injector = new Squire();

    /*
     * -----------------------------------------------
     * Mock ViewModel
     * -----------------------------------------------
     */
    var ViewModel = Backbone.Model.extend({
        notificationReaded: sinon.spy(),
        hideFlash: sinon.spy()
    });
    injector.mock('./view-model/notifications-flash', ViewModel);

    /*
     * -----------------------------------------------
     * ViewModel States
     * -----------------------------------------------
     */
    var VIEW_MODEL_STATES = {
        HIDDEN: {
            show: false
        },
        SHOW_SUCCES: {
            show: true,
            status: 0,
            message: 'missatge flash ok'
        },
        SHOW_INFO: {
            show: true,
            status: 1,
            message: 'missatge flash info'
        },
        SHOW_WARNING: {
            show: true,
            status: 2,
            message: 'missatge flash warning'
        },
        SHOW_ERROR: {
            show: true,
            status: 3,
            message: 'missatge flash error'
        },


    }

    /*
     * -----------------------------------------------
     * Importació i test de la vista
     * -----------------------------------------------
     */
    injector.require(['./view/notifications-flash', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
        describe('Views: Notification Flash', function() {
            beforeEach(function() {
                this.view = ViewSetup.initialize(View);
            });
            afterEach(function() {
                //this.view.destroy();
            });
            describe('Render States', function() {
                it('should create the view', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.hasClass('view-attached')).toBeTruthy();
                        done();
                    }, this));
                    this.view.render();
                });

                it('should not render if hidden', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.find('div').length).toBe(0);
                        done();
                    }, this));
                    this.view.viewModel.set(VIEW_MODEL_STATES.HIDDEN);
                });

                it('should show success notification', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.find('div').length).toBe(4);
                        expect(this.view.$el.find('.R-notificacions-flash').hasClass('info')).not.toBeTruthy();
                        expect(this.view.$el.find('.R-notificacions-flash').hasClass('warning')).not.toBeTruthy();
                        expect(this.view.$el.find('.R-notificacions-flash').hasClass('error')).not.toBeTruthy();
                        expect(this.view.$el.find('div').html()).toContain('missatge flash ok');
                        done();
                    }, this));
                    this.view.viewModel.set(VIEW_MODEL_STATES.SHOW_SUCCES);
                });

                it('should show info notification', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.find('div').length).toBe(4);
                        expect(this.view.$el.find('.R-notificacions-flash').hasClass('info')).toBeTruthy();
                        expect(this.view.$el.find('div').html()).toContain('missatge flash info');
                        done();
                    }, this));
                    this.view.viewModel.set(VIEW_MODEL_STATES.SHOW_INFO);
                });

                it('should show warning notification', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.find('div').length).toBe(4);
                        expect(this.view.$el.find('.R-notificacions-flash').hasClass('warning')).toBeTruthy();
                        expect(this.view.$el.find('div').html()).toContain('missatge flash warning');
                        done();
                    }, this));
                    this.view.viewModel.set(VIEW_MODEL_STATES.SHOW_WARNING);
                });

                it('should show error notification', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.find('div').length).toBe(4);
                        expect(this.view.$el.find('.R-notificacions-flash').hasClass('error')).toBeTruthy();
                        expect(this.view.$el.find('div').html()).toContain('missatge flash error');
                        done();
                    }, this));
                    this.view.viewModel.set(VIEW_MODEL_STATES.SHOW_ERROR);
                });

            });

            describe('Actions and Events', function() {
                it('should close notification', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.find('div').length).toBe(4);
                        this.view.$el.find('.close-action').click();
                        expect(this.view.viewModel.hideFlash.calledOnce).toBeTruthy();
                        done();
                    }, this));
                    this.view.viewModel.set(VIEW_MODEL_STATES.SHOW_SUCCES);
                });

                it('should show notification detail', function(done) {
                    this.view.once('view.render', _.bind(function() {
                        expect(this.view.$el.find('div').length).toBe(4);
                        this.view.$el.find('.R-notificacions-flash').click();
                        expect(this.view.viewModel.notificationReaded.calledOnce).toBeTruthy();
                        done();
                    }, this));
                    this.view.viewModel.set(VIEW_MODEL_STATES.SHOW_SUCCES);
                });
            });

        });
    });
});