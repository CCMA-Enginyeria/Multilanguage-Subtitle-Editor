define(['sinon'], function(sinon) {
	window.jitConfig = {
		staticsResourcesHost: '.',
		baseAPI: 'http://baseAPI/'
	};

	window.SPADebugTools = {
		startProfile: function() {
			return {
				end: function() {

				}
			}
		}
	};
	window.Plugins = {
		Log: {
			print: function(argument) {

			}
		},
		App: {
			confirm: function() {

			},
			getDownloadFormatsFromBaixa: function() {
				return "";
			},
			getDownloadFormatsFromAlta: function() {
				return "";
			},
			browseFolder: function() {
				return 'tests_browseFolder';
			}
		},
		User: {
			getUser: function() {
				return 'digi_tes';
			},
			setUser: function() {

			}
		},
	};
	
	window.requestAnimationFrame = window.setTimeout;
	window.cancelAnimationFrame = window.clearTimeout;

	return true;
});