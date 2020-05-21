define(['sinon'],
	function(sinon) {
		return {
			inicializeMeModel: function() {
				var sortFoldersMap = {};
				sortFoldersMap[1001] = "rundown";
				PreferenciesModel = Backbone.Model.extend({
					defaults: {
						assetDetailTab: 'default',
						lastFormatDownload: 'default',
						sortFolders: sortFoldersMap
					},
					sync: function() { }
				});

				var preferenciesModel = new PreferenciesModel();

				var directoriTreball = new Backbone.Model({
					assetsSeleccionats: 0
				});

				var folderFavCollecion = new Backbone.Collection();
				EspaiModel = Backbone.Model.extend({
					getEstat: function() {
						return "WARNING";
					},

					getPercentatgeDisponible: function() {
						return 71;
					},

					getGB: function() {
						return 250;
					},

					getHores50Mbps: function() {
						return 17;
					},

					getMinuts50Mbps: function() {
						return 43;
					},

					getHores100Mbps: function() {
						return 42;
					},

					getMinuts100Mbps: function() {
						return 56
					}
				});

				var espaiModel = new EspaiModel();

				MeEspaiCollection = Backbone.Collection.extend({
					getEspaiInfoByType: function(type) {
						return espaiModel;
					},
					fetch: sinon.spy()
				});

				var meEspaiCollection = new MeEspaiCollection();

				//MeSearchModel = new Backbone.Model();
				var meCercaModel = new Backbone.Model();

				var groupModel = new Backbone.Model({
					id: 'groupId',
					nom: 'groupName'
				});
				var userGroupsCollection = Backbone.Collection.extend({});
				var userGroups = new userGroupsCollection([groupModel]);

				var estratsCercaCollection = Backbone.Collection.extend({
					getEstrats: function() {
						return null;
					}
				});
				var estratsCollection = new estratsCercaCollection();
				var MeEstratsSearchModel = Backbone.Model.extend({
					get: function(key) {
						if (key === 'cercar') {
							return estratsCollection;
						}

						return Backbone.Model.prototype.get.apply(this, arguments);
					}
				});

				MeEstratsSearchModel = new MeEstratsSearchModel();

				var MeModel = Backbone.Model.extend({
					savePreferencies: function(obj) {
						preferenciesModel.set(obj);
						this.trigger('preferencies.sync');
					},
					get: function(key) {
						if (key === 'preferencies') {
							return preferenciesModel;
						} else if (key === 'directoriTreball') {
							return directoriTreball;
						} else if (key === 'favorits') {
							return folderFavCollecion;
						} else if (key === 'estratsCerca') {
							return MeEstratsSearchModel;
						} else if (key === 'espai') {
							return meEspaiCollection;
						}

						return Backbone.Model.prototype.get.apply(this, arguments);
					},
					setPathDownload: function(path) {
						var pathDownload = path;
					},
					getUsuariGrups: function() {
						return userGroups;
					},
					getCarpetaId: function() {
						return 10;
					},

					getGrupId: function() {
						return groupModel.get('id');
					},
					getCarpetaId: function() {
						return 1001;
					},
					getUsuariLogin: function() {
						return "digi_tes";
					},
					getCarpetaPath: function() {
						return "test";
					},
					getSpaceInfoByType: function(type) {
						return meEspaiCollection.getEspaiInfoByType(type);
					}
				});

				window.meModel = new MeModel();
				return window.meModel;
			},

			inicializeFolderModel: function(type) {
				var folderDetailModel = new Backbone.Model({
					'id': 0,
					'nom': null,
					'grup': null,
					'bloquejaEsborratAssets': null,
					'creat': null,
					'modificat': null,
					'seleccionable': true,
				});
				var groupModel = new Backbone.Model({
					id: 'groupId',
					nom: 'groupName'
				});
				FolderModel = Backbone.Model.extend({
					defaults: {
						"id": 1001,
						"nom": "INGESTES",
						"tipus": type,
						"grup": {
							"id": 1,
							"nom": "default"
						},
						"teFills": true,
						"fills": [{
							"id": 21285362,
							"nom": ".PARAL·LELS",
							"tipus": "FOLDER",
							"grup": {
								"id": 1,
								"nom": "default"
							},
							"teFills": true,
							"numassets": 100,
							"numedits": 0,
							"bloquejaEsborratAssets": false
						}, {
							"id": 9863140,
							"nom": "ACN",
							"tipus": "FOLDER",
							"grup": {
								"id": 1001,
								"nom": "Informatius"
							},
							"teFills": false,
							"numassets": 284,
							"numedits": 0,
							"bloquejaEsborratAssets": false
						}],
						"bloquejaEsborratAssets": false,
						"ordreSegonsEscaleta": false,
						"detall": folderDetailModel,
						"grup": groupModel
					},
					setOrdreSegonsEscaleta: function(sortBy) {
						if (sortBy === 'rundown') {
							this.set({
								ordreSegonsEscaleta: true
							});
						} else {
							this.set({
								ordreSegonsEscaleta: false
							});
						}
					},
					getFills: function() {
						return this.get('fills');
					}
				});

				folderModel = new FolderModel();
				return folderModel;
			},

			inicializeFolderFavModel: function(type) {
				var folderDetailModel = new Backbone.Model({
					'id': 0,
					'nom': null,
					'grup': null,
					'bloquejaEsborratAssets': null,
					'creat': null,
					'modificat': null,
					'seleccionable': true,
				});
				var groupModel = new Backbone.Model({
					id: 'groupId',
					nom: 'groupName'
				});
				FolderFavModel = Backbone.Model.extend({
					defaults: {
						"bloquejaEsborratAssets": false,
						"fills": [

						],
						"grup": groupModel,
						"id": "14768015",
						"nom": "CASTINGS",
						"numAssets": 0,
						"numEditats": 0,
						"teFills": false,
						"teFocus": false,
						"tipus": "FOLDER",
						"oberta": true,
						"ordreSegonsEscaleta": false,
						"isFavorit": false,
						"idFav": 401,
						"assets": [

						],
						"detall": folderDetailModel,
						"carpetaFav": {
							"id": "14768015",
							"nom": "CASTINGS",
							"path": "DIGITION/CASTINGS",
							"tipus": "FOLDER",
							"grup": {
								"id": "1200"
							},
							"detallRuta": [
								{
									"id": 1,
									"nom": "DIGITION"
								},
								{
									"id": 14768015,
									"nom": "CASTINGS"
								}
							]
						}
					},
					setOrdreSegonsEscaleta: function(sortBy) {
						if (sortBy === 'rundown') {
							this.set({ ordreSegonsEscaleta: true });
						}

						else {
							this.set({ ordreSegonsEscaleta: false });
						}
					},
					getFills: function() {
						return this.get('fills');
					}


				});

				folderFavModel = new FolderFavModel();
				return folderFavModel;
			},
			initializeHeaderModel: function() {
				HeaderModel = Backbone.Model.extend({
					defaults: {

					},
					getSpaceInfoByType: function() {
						return {
							getEstat: function() { return '' },
							getPercentatgeDisponible: function() { return '' },
							getGB: function() { return '' },
							getHores50Mbps: function() { return '' },
							getMinuts50Mbps: function() { return '' },
							getHores100Mbps: function() { return '' },
							getMinuts100Mbps: function() { return '' },
						}
					}
				});
				var headerModel = new HeaderModel();
				return headerModel;
			}
		}
	});