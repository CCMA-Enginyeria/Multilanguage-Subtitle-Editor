/*jslint nomen: true*/
define('Cuepoints', [], function () {
	var Cuepoints = function () {
		this.cuepoints = [];
	};
	Cuepoints.prototype = {
		//lastsecond : -1,
		addCuepoint: function (cuepoint) {
			cuepoint.timestopass = 0; //TIMES THAT THE CUEPOINT HAVE TO BE EXECUTED TO EXECUTE THE CALLBACK FUNCTION
			this.cuepoints.push(cuepoint);
			return cuepoint;
		},
		getCuePointsByTime: function (ms) {
			var found = [],
				negativemargin = 0,
				positivemargin = 0;
			_.each(this.cuepoints, function (cuepoint) {
				negativemargin = cuepoint.negativemargin || GLOBALCONFIGURATION.CUEPOINTSMARGIN.NEGATIVE;
				positivemargin = cuepoint.positivemargin || GLOBALCONFIGURATION.CUEPOINTSMARGIN.POSITIVE;
				if (ms >= cuepoint.ms - negativemargin && ms < cuepoint.ms + positivemargin) {
					found.push(cuepoint);
				}
			}, this);

			return found;
		},
		removeCuepoint: function (cues) {
			var position = -1;
			cues = (_.isUndefined(cues.length)) ? [cues] : cues;
			_.each(cues, function (cue) {
				position = _.indexOf(this.cuepoints, cue);
				if (position !== -1) {
					this.cuepoints.splice(position, 1);
				}
			}, this);
		},
		checkCuepoints: function (ms) {
			var cues, toRemove, x, f;
			cues = this.getCuePointsByTime(ms);
			toRemove = [];
			_.each(cues, function (cue) {
				f = cue.callback;
				if (cue.timestopass <= 0) {
					if (cue.once) {
						toRemove.push(cue);
					}
					f(ms, cue);
				} else {
					cue.timestopass = cue.timestopass - 1;
				}
			}, this);
			this.removeCuepoint(toRemove);
		}
	};
	Cuepoints.prototype.constructor = Cuepoints;
	return Cuepoints;
});
/*jslint nomen: false*/