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
		selectTab: jasmine.createSpy('selectTab')
	});
	injector.mock('./view-model/asset-detail', ViewModel);

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/asset-detail', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Asset Detail', function() {
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
				it('should call to select tab when event received', function() {
					this.view.$el.trigger('shown.bs.tab');
					expect(this.view.viewModel.selectTab).toHaveBeenCalled();
				});
			});
		});
	});
});