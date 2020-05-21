require([], function() {
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
		updateEstratOnClipboard: jasmine.createSpy('updateEstratOnClipboard')
	});
	injector.mock('./view-model/estrat-row', ViewModel);

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */
    var VIEW_MODEL_STATE = {
    	SUBMODELS_FETCHED:{
            id: "Estrat",
            descripcio: "1_1002_1",
            durada: {nanos: 5400000000, tc: "00:00:05:10"},
            keyframe: "keyframe1.jpg",
            start: {nanos: 6240000000, tc: "00:00:06:06"},
            stop: {nanos: 11640000000, tc: "00:00:11:16"}
        }
	}

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/estrat-row', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Estrat row', function() {
			beforeEach(function(done) {
				this.view = ViewSetup.initialize(View);
				this.view.once('view.render', function() {
					done();
				});
			});

			describe('Render States', function() {
				it('should create the view', function() {
					expect(this.view.$el.hasClass('view-attached')).toBeTruthy();
				});
			});

			describe('Actions and Events', function() {
				it('should keyframe when it is informated', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('img')[0].src).toContain('keyframe1.jpg');
						done();
					}, this));

					this.view.viewModel.set(VIEW_MODEL_STATE.SUBMODELS_FETCHED);
					this.view.render();
				});

			});
		});
	});
});