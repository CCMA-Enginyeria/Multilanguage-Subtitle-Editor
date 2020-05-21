require([], function() {
	/*
	 * -----------------------------------------------
	 * Configuració bàsica
	 * -----------------------------------------------
	 */

	var injector = new Squire();
	
	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/form/field/editable/textarea', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Text area', function() {
			beforeEach(function(done) {
				this.view = ViewSetup.initialize(View);
				
				this.view.$el.data('template','form/field/editable/titol');
				this.view.$el.data('longitud', '255');
				this.view.$el.data('valor', '[ INSERT Miguel Castells, advocat que va participar al procés de Burgos, - 60:08] "El procés de Burgos va ser un procés polític. El règim va voler desafiar el poble basc i també la resta de lestat espanyol"');
				this.view.$el.data('reduir', true);
				this.view.$el.data('id-classe', 'titol');
				this.view.$el.data('editable' , true);
				this.view.$el.data('edicio', false);
				this.view.$el.data('disabled', false);
				this.view.$el.data('show-edit-action', true);
				
				this.view.once('view.render', function() {
					done();
				});
			});

			afterEach(function() {
				this.view.destroy();
			});
			
			describe('Render States', function() {
				it('should create the view', function() {
					expect(this.view.$el.hasClass('view-attached')).toBeTruthy();
				});
			});

			describe('Actions and Events', function() {
				it('should show full title when click on uncollapse', function(done) {
					this.view.$el.find('.no-collapse-action').click();
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.collapse-action').length).toBe(1);
						done();
					}, this));
				});

			});
		});
	});
});