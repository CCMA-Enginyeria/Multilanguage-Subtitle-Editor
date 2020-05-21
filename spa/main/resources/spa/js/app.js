/*global
	define, require, requirejs, $, moment, jitConfig
 */

requirejs.config({
    baseUrl: './js',
    name: 'app',
    deps: ['./global'],
    paths: {},
    urlArgs: function() {
        return '?v=' + jitConfig.version;
    }
});

define('jquery', [], function() {
    return $;
});

// define('querystring', [], function() {
//     return querystring;
// });

define('moment', [], function() {
    return moment;
});

require(['./init', './views'], function(init) {
    $(document).ready(function() {
        init();
    });
});