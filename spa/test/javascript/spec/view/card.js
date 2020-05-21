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
		openFullEdit: sinon.spy(),
		storeMesInfoStateLS: sinon.spy()
	});
	injector.mock('./view-model/card', ViewModel);

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */
	var VIEW_MODEL_STATES = {
		NO_ASSET: {
			id: null
		},	
			
		LOADING: {
			id: 1,
			carregant: true
		},
		
		FULL_HEADER_ARXIVAT: {
			id: 1,
			teDrets: true,
			isClip: true,
			bloquejat: true,
			arxiu: true
		},
		
		FULL_HEADER_PER_ARXIU: {
			id: 1,
			teDrets: true,
			isClip: true,
			bloquejat: true,
			arxiu: false,
			perArxiu: {
				titol: "Per arxiu",
			}
		},
		
		FULL_CARD: {
			id: 1,
			carregant: false,
			titol: {
				disabled: null,
				edicio: false,
				editable: true,
				valor: "PROVA TITOL",
				longitud: 255
			},
			camps: [
			       {
			    	   tipusVista: "form-field-editable-datetime-view",
			    	   idClasse: "data",
			    	   longitud: 19,
			    	   titol: "Data",	   
			    	   valor: "2018-05-25T14:54:07+02:00",
			    	   reduir: true,
			    	   editable: true,
			    	   edicio: false, 
			    	   disabled: null,
			    	   opcions: undefined		    	   
			       },
			       {
			    	   tipusVista: "form-field-editable-select-view",
			    	   idClasse: "tipusMaterial",
			    	   longitud: 3,
			    	   titol: "Material",	   
			    	   valor: "TRB",
			    	   reduir: true,
			    	   editable: true,
			    	   edicio: false, 
			    	   disabled: null,
			    	   opcions: undefined		    	   
			       }
			],
			emissions: [
			         {
			        	 data: "2011-11-03T22:39:09+01:00",
			        	 programa: "324 NOTÍCIES" 
			         }, 
			         {
			        	 data: "2011-11-04T01:10:58+01:00",
			        	 programa: "324 NOTÍCIES"
			         }
			],
			
			carpetes: [
			         {
			        	 id: "6067675",
			        	 path: "DIGITION/INFORMATIUS/RECURSOS/EDICIÓ/TN COMARQUES/LABORATORI REALITZACIÓ",
			        	 tipus: "FOLDER"
			         },
			         {
			        	 id: "6067676",
			        	 path: "DIGITION/INGESTES/INTERNET INFORMATIUS",
			        	 tipus: "FOLDER",
			         }
			]
		}
		
	}

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/card', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Card', function() {
			
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
				
				it('should not render fitxa if no working asset', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.R-fitxa').length).toBe(0);
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.NO_ASSET);
				});
				
				it('should not render camps if loading', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.R-titol').length).toBe(0);
						expect(this.view.$el.find('.R-camps').length).toBe(0);
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.LOADING);
				});
				
				it('should render full header with asset archived', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.F-drets').length).toBe(1);
						expect(this.view.$el.find('.F-clip').length).toBe(1);
						expect(this.view.$el.find('div.F-candau').length).toBe(1);
						expect(this.view.$el.find('.arxivat-action').length).toBe(1);
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.FULL_HEADER_ARXIVAT);
				});
				
				it('should render full header with asset to archive', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.F-drets').length).toBe(1);
						expect(this.view.$el.find('.F-clip').length).toBe(1);
						expect(this.view.$el.find('div.F-candau').length).toBe(1);
						expect(this.view.$el.find('.F-arxivat span[data-titol=\'Per arxiu\']').length).toBe(1);
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.FULL_HEADER_PER_ARXIU);
				});
				
				it('should render asset card', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.R-titol').attr('data-longitud')).toBe('255');
						expect(this.view.$el.find('.R-titol').attr('data-valor')).toBe('PROVA TITOL');
						expect(this.view.$el.find('.R-titol').attr('data-edicio')).toBe('false');
						expect(this.view.$el.find('.T-dades tr').length).toBe(2);
						expect(this.view.$el.find('.T-dades tr[data-titol=\'Material\']').attr('data-valor')).toBe('TRB');
						expect(this.view.$el.find('.T-dades tr[data-titol=\'Data\']').attr('data-valor')).toBe('2018-05-25T14:54:07+02:00');
						expect(this.view.$el.find('#collapseTwo table tbody tr').length).toBe(2);
						expect(this.view.$el.find('#collapseThree table tbody tr').length).toBe(2);
						
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.FULL_CARD);
				});
			});
		});
	});
});