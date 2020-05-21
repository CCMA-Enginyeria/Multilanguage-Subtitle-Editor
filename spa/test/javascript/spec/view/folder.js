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
		refreshFolder: jasmine.createSpy('refreshFolder')
	});
	injector.mock('./view-model/folder', ViewModel);

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/folder', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Folder', function() {
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
				it('should call refresh folder when press button', function() {
					this.view.$el.trigger('folder-tree.refreshFolder');
					expect(this.view.viewModel.refreshFolder).toHaveBeenCalled();
				});
				it('should call refresh folder when it is close', function() {
					this.view.$el.trigger('dblclick >a.open-asset-handler');
					expect(this.view.viewModel.refreshFolder).toHaveBeenCalled();
				});
			});
		});
	});
});