/*global 
	_, require
 */

window.PluginLoader = {
    plugins: ['player', 'user', 'log', 'app'],
    getAll: function(callback) {
        if (this.AmINativeNET()) {
            this.requireAllPluginsForPlatform('native', callback);
        } else {
            this.requireAllPluginsForPlatform('browser', callback);
        }
    },
    getPluginsPath: function(platform) {
        return _.map(this.plugins, function(pluginName) {
            return 'plugin/' + platform + '/' + pluginName;
        });
    },
    requireAllPluginsForPlatform: function(platform, callback) {
        var pluginsPath = this.getPluginsPath(platform);
        require(pluginsPath, function(Player, User, Log, App) {
            window.Plugins = {
                'Player': Player,
                'User': User,
                'Log': Log,
                'App': App
            };
            callback();
        });
    },
    AmINativeNET: function() {
        return (window.external && _.has(window.external, "IsNativeNET"));
    }
};