/*global 
    define, _
 */

/**
 * Llibreria que permet extreure mètriques de rendiment
 * @module utils/spa-devtools
 */
define([], function() {
    var _profiles = {};
    return {
        startProfile: function(key) {
            _profiles[key] = _profiles[key] || [];
            var startTime = Date.now();
            return {
                end: _.bind(function() {
                    _profiles[key].push(Date.now() - startTime);
                }, this)
            };
        },
        getStats: function(obj) {
            var stats = _.map(_profiles, _.bind(function(profile, key) {
                /*jslint unparam:true*/
                return this.getStatsByKey(key);
            }, this));
            if (obj && obj.orderBy) {
                stats = this.orderStats(stats, obj.orderBy);
            }
            return stats;
        },
        getStatsByKey: function(key) {
            var profile = _profiles[key];
            if (!profile) {
                return;
            }
            return {
                name: key,
                total_calls: profile.length,
                summary: this.getStatsSummary(profile)
            };
        },
        getStatsSummary: function(p) {
            var summary = _.reduce(p, function(previous, time) {
                return {
                    total: previous.total + time,
                    max: Math.max(previous.max, time),
                    min: Math.min(previous.min, time)
                };
            }, {
                total: 0,
                max: 0,
                min: Infinity
            });
            summary.avg = summary.total / p.length;
            return summary;
        },
        orderStats: function(stats, orderBy) {
            switch (orderBy) {
                case 'slower':
                    return _.sortBy(stats, function(stats) {
                        return -stats.summary.max;
                    });
                case 'mostcalled':
                    return _.sortBy(stats, function(stats) {
                        return -stats.total_calls;
                    });
                default:
                    return stats;
            }
        },
        getAllProfiles: function() {
            return _profiles;
        }
    };
});