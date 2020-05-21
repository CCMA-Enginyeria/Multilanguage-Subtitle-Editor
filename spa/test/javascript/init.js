requirejs.config({
	baseUrl: '../../../src/main/resources/digition/js/',
	paths: {
		"test": "../../../../test/",
		'spec': '../../../../test/javascript/spec',
		'jasmine': '../../../../test/javascript/lib/jasmine-2.5.2/jasmine',
		'jasmine-html': '../../../../test/javascript/lib/jasmine-2.5.2/jasmine-html',
		'jasmine-boot': '../../../../test/javascript/lib/jasmine-2.5.2/boot',
		'mock-ajax': '../../../../test/javascript/lib/mock-ajax',
		'sinon': '../../../../test/javascript/lib/sinon-3.0.0',
	},
	shim: {
		'jasmine-html': {
			deps: ['jasmine']
		},
		'jasmine-boot': {
			deps: ['jasmine', 'jasmine-html']
		}
	}
});

require(['jasmine-boot'], function() {
	require([
		'mock-ajax',
		// mock content
		'test/javascript/common/view-mocks',
		'spec/mock/access-video-exporter.js',
		'spec/mock/asset-archive.js',
		'spec/mock/asset-clip-creation-material-collection.js',
		'spec/mock/asset-collection.js',
		'spec/mock/asset-continguts.js',
		'spec/mock/asset-copy.js',
		'spec/mock/asset-emissions.js',
		'spec/mock/asset-folders.js',
		'spec/mock/asset-hqstate.js',
		'spec/mock/asset-lock-unlock.js',
		'spec/mock/asset-media.js',
		'spec/mock/asset-medias.js',
		'spec/mock/asset.js',
		'spec/mock/camps.js',
		'spec/mock/clip.js',
		'spec/mock/estrats-collection.js',
		'spec/mock/estrats-search.js',
		'spec/mock/estrats-type-collection.js',
		'spec/mock/folder-info.js',
		'spec/mock/folder.js',
		'spec/mock/fonts.js',
		'spec/mock/formats.js',
		'spec/mock/hqstate-collection.js',
		'spec/mock/llistat-grups.js',
		'spec/mock/me-espai.js',
		'spec/mock/me-user-features.js',
		'spec/mock/me-user-groups.js',
		'spec/mock/me.js',
		'spec/mock/root-folder.js',
		'spec/mock/search.js',
		'spec/mock/task-copy.js',
		'spec/mock/task-delete.js',
		'spec/mock/task-move.js',
		'spec/mock/task-online.js',
		'spec/mock/tipus-materials.js',
		'spec/mock/versions.js',
		'spec/mock/video-format.js',
		'spec/mock/asset-check-decission.js',
		// include spec files here...
		'spec/model/access-video-exporter.js',
		'spec/model/asset-archive.js',
		'spec/model/asset-check-decission.js',
		'spec/model/asset-clip-creation.js',
		'spec/model/asset-collection.js',
		'spec/model/asset-continguts.js',
		'spec/model/asset-copy.js',
		'spec/model/asset-emissions.js',
		'spec/model/asset-folders.js',
		'spec/model/asset-hqstate.js',
		'spec/model/asset-lock.js',
		'spec/model/asset-locks-collection.js',
		'spec/model/asset-medias.js',
		'spec/model/asset.js',
		'spec/model/auth-token.js',
		'spec/model/camps.js',
		'spec/model/clip.js',
		'spec/model/digition-app.js',
		'spec/model/estrats-collection.js',
		'spec/model/estrats-search.js',
		'spec/model/estrats-type-collection.js',
		'spec/model/folder-detail.js',
		'spec/model/folder.js',
		'spec/model/fonts.js',
		'spec/model/formats.js',
		'spec/model/generic-modal.js',
		'spec/model/hqstate-collection.js',
		'spec/model/llistat-grups.js',
		'spec/model/me-espai.js',
		'spec/model/me-folder.js',
		'spec/model/me-group.js',
		'spec/model/me-user-features.js',
		'spec/model/me-user-groups.js',
		'spec/model/me.js',
		'spec/model/notification-collection.js',
		'spec/model/root-folder.js',
		'spec/model/search.js',
		'spec/model/task-copy.js',
		'spec/model/task-delete.js',
		'spec/model/task-move.js',
		'spec/model/task-online.js',
		'spec/model/tipus-material.js',
		'spec/model/video-format.js',
		// view-model specs
		'spec/view-model/asset-detail.js',
		'spec/view-model/asset-download.js',
		'spec/view-model/card.js',
		'spec/view-model/clip-creator.js',
		'spec/view-model/estrats-list.js',
		'spec/view-model/estrats-toolbar.js',
		'spec/view-model/header.js',
		'spec/view-model/estrat-row.js',
		'spec/view-model/folder.js',
		'spec/view-model/search-box.js',
		// view specs
		'spec/view/asset-collection-list.js',
		'spec/view/asset-detail.js',
		'spec/view/asset-download.js',
		'spec/view/estrats-list.js',
		'spec/view/estrats-toolbar.js',
		'spec/view/header.js',
		'spec/view/card.js',
		'spec/view/clip-creator.js',
		'spec/view/estrat-row.js',
		'spec/view/folder.js',
		'spec/view/form/field/editable/textarea.js',
		'spec/view/notifications-flash.js',
		'spec/view/search-box.js',
	], function() {
		setTimeout(function() {
			window.onload();
		}, 1000);
	})
});