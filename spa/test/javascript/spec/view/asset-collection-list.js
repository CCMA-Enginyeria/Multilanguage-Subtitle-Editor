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
		setVisible: jasmine.createSpy('setVisible')
	});
	injector.mock('./view-model/asset-collection-list', ViewModel);

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/asset-collection-list', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Asset Collection List', function() {
			beforeEach(function(done) {
				this.view = ViewSetup.initialize(View);
				this.view.once('view.render', function() {
					done();
				});
			});
			afterEach(function() {
				this.view.viewModel.setVisible.calls.reset();
			});
			describe('Render States', function() {
				it('should create the view', function() {
					expect(this.view.$el.hasClass('view-attached')).toBeTruthy();
				});
				it('should call to setVisible', function() {
				    expect(this.view.viewModel.setVisible).toHaveBeenCalled();
				    expect(this.view.viewModel.setVisible.calls.count()).toEqual(1);
	                expect(this.view.viewModel.setVisible).toHaveBeenCalledWith(true);
				});
			});
		});
	});
});