/*jslint nomen: true*/
define('SubtitlesPlugin', [], function () {
	var SubtitlesPlugin = function (el, playlist) {
		this.el = el;
		this.defaultStyles = null;
		//this.playlist = playlist;

		this.refresh = _.bind(this.refresh, this);
		this.unload = _.bind(this.unload, this);
		this.clearAndRefresh = _.bind(this.clearAndRefresh, this);

		//this.playlist.addEvent('fullscreen', this.refresh);
		//this.playlist.addEvent('destroy', this.unload);
		//this.playlist.addEvent('seeking', this.clearAndRefresh);
		//this.playlist.addEvent('seeked', this.clearAndRefresh);
		this.setDefaultPersonalization();
	};

	SubtitlesPlugin.prototype = {
		load: function (cuepoints, url) {
			this.cuepoints = cuepoints;
			var that = this,
			onSucces = function (response) {
				//this.loadXML(this.cuepoints, response);
				//parse & init
				that.getTTMetadata(response);
				//Molts valors per defecte ja estan preconfigurats al CSS.
				that.getStylesFromFile(response);
				that.getRegionsFromFile(response);
				that.getEntriesFromFile(response);
				that.setupDefaultActiveRegions();
				that.addCuepoints();
				that.loadedResponse = response;
			},
			onError = function (e) {
				console.error('Error loading');
			};

			//get subt file.
			if (this.loadedResponse) {
				this.addCuepoints();
				return;
			}
			if ($.ajax) {
				$.ajax({
					url: url,
					success: onSucces,
					error: onError
				});
			} else {
				ajaxLib.getAJAXResponse({
					url: url,
					type: 'xml',
					onSucces: onSucces,
					onError: onError
				});
			}
			


		},
		loadXML: function (cuepoints, xml) {
			this.cuepoints = cuepoints;
			var that = this;				
			//parse & init
			that.getTTMetadata(xml);
			//Molts valors per defecte ja estan preconfigurats al CSS.
			that.getStylesFromFile(xml);
			that.getRegionsFromFile(xml);
			that.getEntriesFromFile(xml);
			that.setupDefaultActiveRegions();
			that.addCuepoints();
			that.loadedResponse = xml;
		},
		


		unload: function () {
			this.removeCuepoints();
			this.clearSubtitlesDiv();
		},
		clearSubtitlesDiv: function () { //esborrem subtitols
			this.el.innerHTML = '';
		},
		clearAndRefresh: function () { //esborrem subtitols
			setTimeout(_.bind(function () {
				this.clearSubtitlesDiv();
				this.refresh();
			}, this), 0);
		},
		clearAndRefreshNoTimeout: function () { //esborrem subtitols
				this.clearSubtitlesDiv();
				this.refresh();
		},
		refresh: function () { // recalcul del tamany
			setTimeout(_.bind(function () {
				this.setDefaultConfiguration();
				this.setupDefaultActiveRegions();
			}, this), 0);
		},
		getTTMetadata: function (ttNode) {
			var ttNodeObject,
				ttNodeDefaultConfig = {
					'cellResolution': {
						'columns': 40,
						'rows': 24
					}
				};
			//parseamos el nodo xml, para coger los atributos y los metemos en un objeto k,v
			ttNodeObject = _.compact(_.map(ttNode.attributes, function (attr) {
				return this.parseTTAtributtes(attr.nodeName, attr.nodeValue, ttNode);
			}, this));

			this.ttNodeConfig = _.reduce(ttNodeObject, function (memo, value) {
				_.each(value, function (v, k) {
					memo[k] = v;
				});
				return memo;
			}, ttNodeDefaultConfig); //Start from defaultValue

			this.setDefaultConfiguration();
		},
		setDefaultConfiguration: function () {
			this.el.style.fontSize = this.convertCtoPx('1c', 'y'); // anchura de la celda
		},
		getStylesFromFile: function (file) {
			var ss, id, styleObject;
			ss = this.ttNamespaceHelper(file, 'style');
			this.styles = {};
			//parseamos el nodo xml, para coger los atributos y los metemos en un objeto k,v
			_.each(ss, function (sty) {
				styleObject = _.compact(_.map(sty.attributes, function (attr) {
					return this.parseTTAtributtes(attr.nodeName, attr.nodeValue, sty);
				}, this));
				styleObject = _.reduce(styleObject, function (memo, value) {
					_.each(value, function (v, k) {
						memo[k] = v;
					});
					return memo;
				}, {});
				this.styles[sty.getAttribute('xml:id')] = styleObject;
			}, this);
		},
		parseTTAtributtes: function (nodeName, nodeValue, sty) {
			var that = this,
				ttsDimensionArray,
				cellResolutionArray;
			switch (nodeName) {
			case 'ttp:cellResolution':
				cellResolutionArray = nodeValue.split(" ");
				return {
					'cellResolution': {
						'columns': cellResolutionArray[0],
						'rows': cellResolutionArray[1]
					}
				};
			case 'tts:backgroundColor':
				return {
					'backgroundColor': that.hexToRgba(nodeValue)
				};
			case 'tts:color':
				return {
					'color': that.hexToRgba(nodeValue)
				};
			case 'tts:fontFamily':
				return {
					'fontFamily': nodeValue
				};
			case 'tts:fontSize':
				return {
					'fontSize': function (el) {
						var fontSize = nodeValue;
						if (that.personalizationEnabled) {
							fontSize = that.getFontSizePersonalizedValue();
						}
						return fontSize;
					}
				};
			case 'tts:fontStyle':
				return {
					'fontStyle': nodeValue
				};
			case 'tts:fontWeight':
				return {
					'fontWeight': nodeValue
				};
			case 'tts:lineHeight':
				return {
					'lineHeight': nodeValue
				};
			case 'tts:textDecoration':
				return {
					'textDecoration': nodeValue
				};
			case 'tts:textAlign':
				return {
					textAlign: function () {
						//“left” | “center” | “right”| “start” |“end” >> 3 primer OK i els 2 ultims no son css Syntax?
						// TBD depenen del writing mode de la regió,
						return nodeValue;
					}
				};
			case 'tts:wrapOption':
				// el valor wrap es una propietat css "normal" i el valor noWrap es nowrap, valid com a CSS
				return {
					// 'whiteSpace': ((nodeValue === 'wrap') ? 'normal' : 'nowrap')
					'whiteSpace':'nowrap'
				};
			case 'ebutts:multiRowAlign':
				return {
					'noop-multiRowAlign': function (el) {
						_.each(el.getElementsByClassName('multiRowAlign'), function (node) {
							node.className += ' multiRowAlign-' + nodeValue;
						});
					}
				};
			case 'ebutts:linePadding':
				return {
					'noop-linePadding': function (el) {
						var linePadding = that.convertCtoPx(nodeValue, 'x'),
							padding = '0px ' + linePadding;

						_.each(el.getElementsByClassName('subtitle-line'), function (subtitleLineEl) {
							subtitleLineEl.style.padding = padding;
						});
						return;
					}
				};
			case 'tts:origin':
				return {
					'noop-origin': function (el) {
						var ttsPositionArray = nodeValue.split(" "),
							top = ttsPositionArray[1],
							left = ttsPositionArray[0],
							height;
						if (that.personalizationEnabled && that.getSubtPositionPersonalized() === 'top') {
							height = parseFloat(sty.getAttribute('tts:extent').split(' ')[1].split('%')[0]);
							top = parseFloat(top.split('%')[0]);
							top = (100 - (top + height)) + '%';
						}
						el.style.top = top;
						el.style.left = '50%';
						el.style.transform = 'translate(-50%,0)';
					}
				};
			case 'tts:extent':
				ttsDimensionArray = nodeValue.split(" ");
				return {
					'width': ttsDimensionArray[0],
					'height': ttsDimensionArray[1]
				};
			case 'tts:padding':
				return {
					'noop-padding': function (el) {
						_.each(el.getElementsByClassName('regionPadding'), function (node) {
							node.style.padding = nodeValue;
						});
					}
				};
			case 'tts:showBackground': //“always” | “whenActive”
				if (nodeValue === "whenActive") {
					return {
						backgroundColor: function () {
							var style = that.styles[sty.getAttribute('style')];
							return style.backgroundColor;
						}
					};
				} else {
					return {
						'noop-showBackground': true
					};
				}
			case 'tts:overflow':
				return {
					'overflow': nodeValue
				};
			case 'style':
				return this.styles[nodeValue];
			case 'tts:displayAlign':
				return {
					'noop-displayAlign': function (el) {
						var v = nodeValue;
						if (that.personalizationEnabled) {
							v = (that.getSubtPositionPersonalized() === 'top') ? 'before' : 'after';
						}
						_.each(el.getElementsByClassName('displayAlign'), function (node) {
							node.className += ' displayAlign-' + v;
						});
					}
				};
			case 'tts:dir':
				return {
					'noop-dir': function (el) {
						el.dir = nodeValue;
					}
				};
			case 'tts:unicode-bidi':
				return {
					'unicode-bidi': nodeValue
				};
			}			
			
		},
		getRegionsFromFile: function (file) {
			var ss, id, styleObject;
			ss = this.ttNamespaceHelper(file, 'region');
			this.regions = {};
			//parseamos el nodo xml, para coger los atributos y los metemos en un objeto k,v
			_.each(ss, function (sty) {
				styleObject = _.compact(_.map(sty.attributes, function (attr) {
					return this.parseTTAtributtes(attr.nodeName, attr.nodeValue, sty);
				}, this));
				styleObject = _.reduce(styleObject, function (memo, value) {
					_.each(value, function (v, k) {
						memo[k] = v;
					});
					return memo;
				}, {});
				this.regions[sty.getAttribute('xml:id')] = styleObject;
			}, this);
		},
		setupDefaultActiveRegions: function () {
			var regionElement;
			_.each(this.regions, function (reg) {
				if (reg['noop-showBackground']) {
					regionElement = document.createElement('div');
					regionElement.className = 'region';
					regionElement = this.applyTTMLAttrToHTMLElement(regionElement, reg);
					this.el.appendChild(regionElement);
				}
			}, this);
		},
		getEntriesFromFile: function (file) {
			var ps;
			this.getDefaultStyles(file);

			ps = this.ttNamespaceHelper(file, 'p');
			this.entries = [];

			_.each(ps, function (p, i) {
				p = this.getEntry(p, i);
				if (!_.isUndefined(p)) {
					this.entries.push(p);
				}
			}, this);			
		},
		getEntry: function (p, i) {
			var textBuffer = this.parseEntryTTNodes(p);
			if(p.getElementsByTagName("tt:br")[0]){
				var elements = p.textContent.split("\n")
				var textContent = elements[1];var textContent2 = elements[3]
				
				
				return {
					begin: this.timeToMS(p.getAttribute('begin')),
					end: this.timeToMS(p.getAttribute('end')),
					id: p.getAttribute('xml:id') || i,
					viewed: p.getAttribute('viewed'),
					edited: p.getAttribute('edited'),
					reviewerEdited: p.getAttribute('reviewerEdited'),
					conflict: p.getAttribute('conflict'),
					accepted: p.getAttribute('accepted'),
					lastWorked: p.getAttribute('lastWorked'),
					editionOnCourse: p.getAttribute('editionOnCourse'),
					//style: p.firstElementChild.getAttribute('style'),
					//style: p.childNodes[1].getAttribute('style'),
					style: p.getAttribute('style'),
					region: p.getAttribute('region'),
					text: textBuffer,
					dualText: true,
					textContent: textContent,
					textContent2: textContent2,
					ebuttText: p.innerHTML,
				};
			}else{				
				var textContent = p.textContent.trim()
				return {
					begin: this.timeToMS(p.getAttribute('begin')),
					end: this.timeToMS(p.getAttribute('end')),
					id: p.getAttribute('xml:id') || i,
					viewed: p.getAttribute('viewed'),
					edited: p.getAttribute('edited'),
					reviewerEdited: p.getAttribute('reviewerEdited'),
					conflict: p.getAttribute('conflict'),
					accepted: p.getAttribute('accepted'),
					lastWorked: p.getAttribute('lastWorked'),
					editionOnCourse: p.getAttribute('editionOnCourse'),
					//style: p.firstElementChild.getAttribute('style'),
					style: p.getAttribute('style'),
					region: p.getAttribute('region'),
					text: textBuffer,
					dualText:false,
					//textContent: p.textContent,
					textContent: textContent,
					textContent2: "",
					ebuttText: p.innerHTML,
				};

				// return {
				// 	begin: this.timeToMS(p.getAttribute('begin')),
				// 	end: this.timeToMS(p.getAttribute('end')),
				// 	id: p.getAttribute('xml:id') || i,
				// 	viewed: p.getAttribute('viewed'),
				// 	edited: p.getAttribute('edited'),
				// 	reviewerEdited: p.getAttribute('reviewerEdited'),
				// 	conflict: p.getAttribute('conflict'),
				// 	accepted: p.getAttribute('accepted'),
				// 	lastWorked: p.getAttribute('lastWorked'),
				// 	//style: p.firstElementChild.getAttribute('style'),
				// 	style: p.getAttribute('style'),
				// 	region: p.getAttribute('region'),
				// 	text: textBuffer,
				// 	textContent: p.textContent,
				// 	ebuttText: p.innerHTML,
				// };
			}
			// for(i=0;i<p.childNodes.length;i++){
			// 	if(p.childNodes[i].textContent !="" && p.childNodes[i].textContent){
			// 		if (text != ""){
			// 			text = text + " "
			// 		}
			// 		text = text + p.childNodes[i].textContent
			// 	}
			// }						
			// return {
			// 	begin: this.timeToMS(p.getAttribute('begin')),
			// 	end: this.timeToMS(p.getAttribute('end')),
			// 	id: p.getAttribute('xml:id') || i,
			// 	viewed: p.getAttribute('viewed'),
			// 	edited: p.getAttribute('edited'),
			// 	reviewerEdited: p.getAttribute('reviewerEdited'),
			// 	conflict: p.getAttribute('conflict'),
			// 	accepted: p.getAttribute('accepted'),
			// 	lastWorked: p.getAttribute('lastWorked'),
			// 	//style: p.firstElementChild.getAttribute('style'),
			// 	style: p.getAttribute('style'),
			// 	region: p.getAttribute('region'),
			// 	text: textBuffer,
			// 	textContent: p.textContent,
			// 	ebuttText: p.innerHTML						
			// };
			
		},
		getDefaultStyles: function (file) {
			var style, divNode, bodyNode;

			this.defaultStyles = [];

			divNode = this.ttNamespaceHelper(file, 'div');
			style = divNode[0].getAttribute("style");
			if (style !== null) {
				this.defaultStyles.push(style);
			}

			bodyNode = this.ttNamespaceHelper(file, 'body');
			style = bodyNode[0].getAttribute("style");
			if (style !== null) {
				this.defaultStyles.push(style);
			}
		},
		parseEntryTTNodes: function (p) { //Funció recursiva.
			var result = "",
				childString, el;

			result = _.map(p.childNodes, function (child) {
				switch (child.nodeName) {
				case 'tt:span':
				case 'span':
					//un span pot tenir també estils TODO, aplicar estils en bucle.
					el = document.createElement("span");
					el.className = 'span-subtitle';
					el = this.applyTTMLStyleIdToHTMLElement(el, child.getAttribute('style'));
					break;
				case 'tt:br':
				case 'br':
					el = document.createElement("br");
					break;
				case '#text':
					el = (child.textContent.trim().length > 0) ? '<span class="subtitle-line">' + child.textContent + '</span>' : '';
					break;
				}
				if (child.childNodes && child.childNodes.length > 0) {
					el.innerHTML = this.parseEntryTTNodes(child);
				}
				return el.outerHTML || el;
			}, this).join('');
			return result;
		},
		timeToMS: function (time) {
			var ms = 0,
				blocks, secondsBlock;

			blocks = time.split(':');
			ms += parseInt(blocks[0], 10) * 3600; // horas
			ms += parseInt(blocks[1], 10) * 60; //  minutos

			secondsBlock = blocks[2].split('.');
			ms += parseInt(secondsBlock[0], 10); //segundos
			ms *= 1000;
			if (secondsBlock.length > 1) {
				ms += parseInt(secondsBlock[1], 10); //frames en ms
			}
			return ms;
		},		
		hexToRgba: function (hex) {

			if (hex.length === 7) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex),
					r = parseInt(result[1], 16),
					g = parseInt(result[2], 16),
					b = parseInt(result[3], 16),
					resultToString;
				return 'rgb(' + r + ',' + g + ',' + b + ')';
			}

			if (hex.length === 9) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex),
					r = parseInt(result[1], 16),
					g = parseInt(result[2], 16),
					b = parseInt(result[3], 16),
					alfaInDecimal = parseInt(result[4], 16),
					alfaInFloat = (alfaInDecimal / 255).toFixed(1);
				return 'rgba(' + r + ',' + g + ',' + b + ',' + alfaInFloat + ')';
			}

			return null;
		},
		addCuepoints: function () {
			var that = this,
				addedCuepoint;
			this.removeCuepoints();
			_.each(this.entries, function (entry) {
				addedCuepoint = this.cuepoints.addCuepoint({
					ms: entry.begin,
					callback: this.showSubtitle(entry),
					negativemargin: GLOBALCONFIGURATION.SUBTITLES.BEGINCUEPOINTSMARGIN.NEGATIVE,
					positivemargin: GLOBALCONFIGURATION.SUBTITLES.BEGINCUEPOINTSMARGIN.POSITIVE
				});
				this.addedCuepoints.push(addedCuepoint);

				/* Eliminar subtitulos por evento*/
				addedCuepoint = this.cuepoints.addCuepoint({
					ms: entry.end,
					callback: this.hideSubtitle(entry),
					negativemargin: GLOBALCONFIGURATION.SUBTITLES.ENDCUEPOINTSMARGIN.NEGATIVE,
					positivemargin: GLOBALCONFIGURATION.SUBTITLES.ENDCUEPOINTSMARGIN.POSITIVE
				});
				this.addedCuepoints.push(addedCuepoint);
			}, this);
		},
		removeCuepoints: function () {
			var that = this;
			this.addedCuepoints = this.addedCuepoints || [];
			_.each(this.addedCuepoints, function (cue) {
				this.cuepoints.removeCuepoint(cue);
			}, this);
			this.addedCuepoints = [];
		},
		showSubtitle: function (subt) {
			var that = this;
			return function () {
				var defaultStyleWrapper, paragraphContainer, regionContainer;

				if (that.el.innerHTML.indexOf('id="' + subt.id + '"') !== -1) {
					return;
				}
				defaultStyleWrapper = document.createElement('div');

				_.each(that.defaultStyles, function (style) {
					defaultStyleWrapper = that.applyTTMLStyleIdToHTMLElement(defaultStyleWrapper, style);
				}, that);


				paragraphContainer = document.createElement('div');
				paragraphContainer.className = 'paragraphContainer';
				paragraphContainer.innerHTML = '<div class="multiRowAlign">' + subt.text + '</div>';
				paragraphContainer = that.applyTTMLStyleIdToHTMLElement(paragraphContainer, subt.style);

				regionContainer = document.createElement('div');
				regionContainer.id = subt.id;
				regionContainer.className = 'regionContainer';
				regionContainer.innerHTML = '<div class="displayAlign regionPadding">' + paragraphContainer.outerHTML + '</div>';

				if (that.personalizationEnabled) {
					if (that.getBackgroundPersonalizedValue() === 'active') {
						regionContainer.className += ' user-force-background';
					} else {
						regionContainer.className += ' user-no-background';
					}
				}

				regionContainer = that.applyTTMLRegionIdToHTMLElement(regionContainer, subt.region);

				defaultStyleWrapper.appendChild(regionContainer);
				that.el.appendChild(defaultStyleWrapper);
			};
		},
		hideSubtitle: function (subt) {
			var that = this;
			return function () {
				var subtElement = document.getElementById(subt.id);
				if (subtElement) {
					that.el.removeChild(subtElement.parentNode);
					//the root point is parentNode, where we add defaultStyles
				}
			};
		},
		applyTTMLStyleIdToHTMLElement: function (el, styleId) {
			if (styleId) {
				var styleCandidates = styleId.split(" ");

				_.each(styleCandidates, function (x) {
					el = this.applyTTMLAttrToHTMLElement(el, this.styles[x]);
				}, this);
			}
			return el;
		},
		applyTTMLRegionIdToHTMLElement: function (el, regionId) {
			return this.applyTTMLAttrToHTMLElement(el, this.regions[regionId]);
		},
		applyTTMLAttrToHTMLElement: function (el, attrs) {
			_.each(attrs, function (attr, attrName) {
				try {
					if (attrName.indexOf('noop-') === 0) {
						attr(el);
					} else {
						el.style[attrName] = _.isFunction(attr) ? attr(el) : attr;
					}
				} catch (e) {

				}
			}, this);
			return el;
		},
		getRemoveSubtCallback: function (subtElement) {
			var that = this;
			return function () {
				that.el.removeChild(subtElement);
			};
		},
		convertCtoPx: function (value, direction) {
			//Tendriamos que transformar las unidades "c" en algo valido, en base al cellResolution.
			//Segun specs hay que dividir el tamaño en rows & columns y, si no se indica lo contrario,
			var cellSize;
			if (direction === "x") {
				cellSize = this.el.offsetWidth / this.ttNodeConfig.cellResolution.columns;
			} else {
				cellSize = this.el.offsetHeight / this.ttNodeConfig.cellResolution.rows;
			}

			value = value.replace(/(\d+(?:\.\d*)?)c\b/g, function (str, p1) {
				return (p1 * cellSize) + 'px';
			});
			return value;
		},
		ttNamespaceHelper: function (file, tag) {
			//ens permet mantenir compatibilitat hbbtv i html5.
			var tagChildren = file.getElementsByTagName('tt:' + tag);
			if (tagChildren.length === 0) {
				tagChildren = file.getElementsByTagName(tag);
			}
			return tagChildren;
		},
		ttStylePositioningHelper: function (style, tag) {
			var value = style.getAttribute(tag);
			return value.split(" ");
		},
		setDefaultPersonalization: function () {
			this.personalizationEnabled = null;
			this.personalizationBackgroundActive = null;
			this.personalizationFontSizeIndex = null;
			this.personalizationFontSizeValues = ["140%", "180%", "220%"];
			this.personalizationSubtPositionOnTop = null;
		},
		setPersonalizationActivation: function (value) {
			this.personalizationEnabled = value;
			this.clearSubtitlesDiv();
		},
		setBackgroundPersonalized: function (value) {
			this.personalizationBackgroundActive = value;
			this.clearSubtitlesDiv();
		},
		setFontSizePersonalized: function (value) {
			this.personalizationFontSizeIndex = value;
			this.clearSubtitlesDiv();
		},
		setPositionPersonalized: function (value) {
			this.personalizationSubtPositionOnTop = value;
			this.clearSubtitlesDiv();
		},
		getSubtPositionPersonalized: function () {
			return (this.personalizationSubtPositionOnTop) ? 'top' : 'bottom';
		},
		getBackgroundPersonalizedValue: function () {
			return (this.personalizationBackgroundActive) ? 'active' : 'disabled';
		},
		getFontSizePersonalizedValue: function () {
			return this.personalizationFontSizeValues[this.personalizationFontSizeIndex];
		}
	};
	SubtitlesPlugin.prototype.constructor = SubtitlesPlugin;
	return SubtitlesPlugin;
});
/*jslint nomen: false*/