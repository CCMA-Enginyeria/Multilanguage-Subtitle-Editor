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
		putAllStratsOnClipboard: jasmine.createSpy('putAllStratsOnClipboard'),
		removeAllStratsFromClipboard: jasmine.createSpy('removeAllStratsFromClipboard')
	});
	injector.mock('./view-model/estrats-list', ViewModel);

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/estrats-list', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Estrat list', function() {
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
				it('should call removeAllStratsFromClipboard when click desmarcar tots', function() {
					this.view.$el.trigger('uncheckAllStratsOnPage');
					expect(this.view.viewModel.removeAllStratsFromClipboard).toHaveBeenCalled();
				});
				it('should call putAllStratsOnClipboard when click marcar tots', function() {
					this.view.$el.trigger('checkAllStratsOnPage');
					expect(this.view.viewModel.putAllStratsOnClipboard).toHaveBeenCalled();
				});
				it('should call putAllStratsOnClipboard when click checkbox', function() {
					this.view.$el.trigger('toggleCheckStratsOnPage');
					expect(this.view.viewModel.putAllStratsOnClipboard).toHaveBeenCalled();
				});
			});
		});
	});
});