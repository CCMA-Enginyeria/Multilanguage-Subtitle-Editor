/**
 * @module model/digition-app
 */

define(['./subtitle-box', 'SubtitlesPlugin', './iso639-1', '../utils/xml-parser', './modal-template', './modal-title-description'], function (SubtitleBox, SubtitlesPlugin, ISO6391, XMLParser, ModalTemplateModel, ModalTitleTemplateModel) {
    var instance = null;
    var SubtitlesBoxCollection = Backbone.Collection.extend({

        model: SubtitleBox,
        iso6391: ISO6391,
        escapedXML: '',
        defaults: {
            originalLanguage: '',
            translatedLanguage: '',
            subtitlesfile: '',
            autosubtitlesfile: '',
            defaultdocument: '',
            subtitles: '',
            escapedXML: '',
            taskstate: '',
            loadedoriginal: false,
            loadedautomatic: false,
            emptyAutoSubtitles: false,
            entries: [],
            editedNum: 0,
            editedPerc: 0,
            acceptedNum: 0,
            acceptedPerc: 0,
            viewedNum: 0,
            viewedPerc: 0,
            totalNum: 0,
            totalPerc: 0,
            currentSubNumber: 0,
            titleAccepted: false,
            synopsisAccepted: false,
            subtitlesDone: true,
            titleAccepted: false,
            synopsisAccepted: false,
            titleConflictStatus: false,
            synopsisConflictStatus: false,
            creditsAdded: true,
        },

        initialize: function (models, options) {
            this.json = options
            this.jsondata = options.data;
            this.taskstate = options.status
            this.modalTitleTemplateModel = ModalTitleTemplateModel.getInstance();

            if (this.jsondata) {
                this._setTitleAndDescriptionDefault();
                this.subtitlesfile = XMLParser.parseFromString(this.jsondata.original_text, "application/xml");
                this._setCreditsRegionStyle();

                if (!this.isNullOrWhitespace(this.jsondata.auto_text)) {
                    this.autosubtitlesfile = XMLParser.parseFromString(this.jsondata.auto_text, "application/xml");
                }
                if (!(this.taskstate == "AwaitingForEdition")) {
                    this.defaultdocument = XMLParser.parseFromString(this.jsondata.translated_text, "application/xml");
                }
                if (this.defaultdocument) {
                    this.translatedTitle = this.jsondata.translated_title
                    this.translatedSynopsis = this.jsondata.translated_synopsis
                } else {
                    this.taskstate = 'AwaitingForEdition';
                    this.translatedTitle = this.jsondata.auto_title
                    this.translatedSynopsis = this.jsondata.auto_synopsis
                }
                this.originalLanguage = this.iso6391[this.json.data.language_source];
                this.translatedLanguage = this.iso6391[this.json.data.language_target];

                //Populate Synospsis and Title.
                this.modalTitleTemplateModel.set({
                    titleConflict: this.titleConflictStatus,
                    synopsisConflict: this.synopsisConflictStatus,
                    titleAccepted: this.titleAccepted,
                    synopsisAccepted: this.synopsisAccepted,
                    titleEdited: this.titleEdited,
                    synopsisEdited: this.synopsisEdited,
                    titleReviewerEdited: this.titleReviewerEdited,
                    synopsisReviewerEdited: this.synopsisReviewerEdited,
                    translatedTitle: this.translatedTitle,
                    translatedSynopsis: this.translatedSynopsis,

                    originalSynopsis: this.jsondata.original_synopsis,
                    autoSynopsis: this.jsondata.auto_synopsis,
                    originalTitle: this.jsondata.original_title,
                    autoTitle: this.jsondata.auto_title,

                })
                this.listenTo(this.modalTitleTemplateModel, 'change:titleAccepted change:synopsisAccepted', this._checkTitleAndSynopsis);
                this.listenTo(this.modalTitleTemplateModel, 'change:titleConflict change:synopsisConflict', this._checkTitleAndSynopsis);
                this.listenTo(this.modalTitleTemplateModel, 'change:translatedTitle change:translatedSynopsis', this._updateTitleAndSynopsis);

                this.isCorrection = this.jsondata.reject_reason != null ? true : false;
            } else {
                this.subtitlesfile = document.implementation.createDocument(null, "books");
            }
            this.subtitlesPlugin = new SubtitlesPlugin(document.createElement('div'));
            this.finishEnabled = false;
            Backbone.Collection.prototype.initialize.apply(this, arguments);
            instance = this;
            this.listenTo(this, 'change', this.isAutoLoaded());
            this.listenTo(this, 'change', this._enableFinish);

        },

        //Parse both Automated subtitles and Original Subtitles              
        getSubtitlePluginData: function () {
            if (this.isOriginalLoaded() && !this.isAutoLoaded()) {
                //Parse the document created from the automated subtitles file from JSON using subtitles.js
                var subt = this.autosubtitlesfile
                if (!this.isNullOrWhitespace(subt)) {
                    this.subtitlesPlugin.getEntriesFromFile(subt);
                    this.models[0].id == 'credits' ? credits = 1 : credits = 0;
                    for (i = 0; i < this.subtitlesPlugin.entries.length; i++) {
                        //Setting additional values to the models previously registered on the
                        //entries created by the original subtitle file
                        this.models[i + credits].set({
                            textAuto: this.subtitlesPlugin.entries[i].textContent,
                            textAuto2: this.subtitlesPlugin.entries[i].textContent2,
                            ebuttText: this._replaceAll(this.subtitlesPlugin.entries[i].ebuttText, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                            newsubt: this._replaceAll(this.subtitlesPlugin.entries[i].textContent, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                            lastsubt: this._replaceAll(this.subtitlesPlugin.entries[i].textContent, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                            subnumber: i + 2,
                            newsubt2: this._replaceAll(this.subtitlesPlugin.entries[i].textContent2, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                            dualText: this.subtitlesPlugin.entries[i].dualText,

                        }, {
                            silent: true
                        });
                        if (this.models[i + credits].get('ebuttText') == "") {
                            var styleId = this._getMostUsedStyle(subt);
                            var emptyEbuttdText = "<tt:span style='" + styleId + "'></tt:span>";
                            this.models[i + credits].set('ebuttText', emptyEbuttdText);
                        };
                        this.models[this.models.length - 1].set({
                            lastmodel: true,
                        }, {
                            silent: true
                        })

                    }
                } else {
                    this.models.forEach(function (item, index) {
                        //Setting additional values to the models previously registered on the
                        //entries created by the original subtitle file                    
                        item.set({
                            textAuto: "Empty",
                            textAuto2: "Empty",
                            ebuttText: "<tt:span style=\"ss6\">Empty.</tt:span>",
                            newsubt: "Empty.",
                            lastsubt: "Empty.",
                            subnumber: index + 2,
                        }, {
                            silent: true
                        });
                    });
                    this.modalTitleTemplateModel.set({
                        autoTitle: "Empty title",
                        autoSynopsis: "Empty synopsis",
                    });
                    this._createAutoEmptyDocument();
                }
                //Make the default subtitles document on which changes will be made
                if (!(this.taskstate == "AwaitingForEdition")) {
                    if (!(this.taskstate == "AwaitingForRevision" && this.defaultdocument.getElementsByTagName('tt:p').length == 0)) {
                        var subt = this.defaultdocument
                        if (!this.isNullOrWhitespace(subt)) {
                            this.subtitlesPlugin.getEntriesFromFile(subt);
                            this.models[0].id == 'credits' && !(this.defaultdocument.getElementsByTagName('tt:p')[0].getAttribute('xml:id') == 'credits') ? credits = 1 : credits = 0;
                            for (i = 0; i < this.length - credits; i++) {
                                //Setting additional values to the models previously registered on the
                                //entries created by the original subtitle file
                                this.models[i + credits].set({
                                    viewed: this.subtitlesPlugin.entries[i].viewed == 'true',
                                    edited: this.subtitlesPlugin.entries[i].edited == 'true',
                                    reviewerEdited: this.subtitlesPlugin.entries[i].reviewerEdited == 'true',
                                    editionOnCourse: this.subtitlesPlugin.entries[i].editionOnCourse == 'true',
                                    conflict: this.subtitlesPlugin.entries[i].conflict == 'true',
                                    newsubt: this._replaceAll(this.subtitlesPlugin.entries[i].textContent, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                                    newsubt2: this._replaceAll(this.subtitlesPlugin.entries[i].textContent2, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                                    dualText: this.subtitlesPlugin.entries[i].dualText,
                                    lastsubt: this._replaceAll(this.subtitlesPlugin.entries[i].textContent, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                                    lastsubt2: this._replaceAll(this.subtitlesPlugin.entries[i].textContent2, ' xmlns:tt="http://www.w3.org/ns/ttml"', '').trim(),
                                    lastWorked: this.subtitlesPlugin.entries[i].lastWorked == 'true',
                                    accepted: this.subtitlesPlugin.entries[i].accepted,
                                    isCorrection: this.isCorrection,
                                }, {
                                    silent: true
                                });
                                if (this.models[i].get('accepted') && this.models[i].get('conflict')) {
                                    this.models[i].set('conflict', false);
                                };

                            }
                            this._retrieveTitleAndSynopsis(subt);
                        }
                    }
                }
                else {
                    for (i = 0; i < this.length; i++) {
                        if (this.models[i].get('textContent2') != "") {
                            this.models[i].set('dualText', true);
                        }
                    }
                }
                this.loadedautomatic = true;
                this._checkRTLLanguages();
            } else {
                //Recover Original subtitles and populate collection
                if (this.taskstate == "AwaitingForEdition") {
                    this.defaultdocument = this.subtitlesfile.cloneNode(true);
                }
                var subt = this.subtitlesfile
                this.subtitlesPlugin.getTTMetadata(subt);
                this.subtitlesPlugin.getStylesFromFile(subt);
                this.subtitlesPlugin.getRegionsFromFile(subt);
                this.subtitlesPlugin.getEntriesFromFile(subt);
                this.loadedoriginal = true;
                this.set(this.parse(this.subtitlesPlugin.entries));
                this._addCredits();
            }
            this._addCredits();
            this.trigger('sync');

        },


        //Create an empty document in case of need when there is no automated subtitle
        //to be able to render the subtitles in EBUTTD format
        _createAutoEmptyDocument: function () {
            this.autosubtitlesfile = "";
            var xmlDoc = this.defaultdocument.cloneNode(true);
            var xmlseri = new XMLSerializer()
            if (xmlDoc.getElementsByTagName('tt:div')[0]) {
                xmlDoc.getElementsByTagName('tt:div')[0].innerHTML = ""
                for (i = 0; i < this.length; i++) {
                    var nodeTTP = xmlDoc.createElement("tt:p");
                    var subnodeSpan = nodeTTP.setAttribute("xml:id", this.at(i).id);
                    nodeTTP.setAttribute("region", this.at(i).get('region'));
                    nodeTTP.setAttribute("begin", this._msToDotTime(this.at(i).get('begin')));
                    nodeTTP.setAttribute("end", this._msToDotTime(this.at(i).get('end')));
                    var spanebuttd = XMLParser.parseFromString(this.at(i).get('ebuttText'), "text/xml");
                    var newsubt = this.at(i).get('newsubt');
                    spanebuttd.getElementsByTagName('tt:span')[0].innerHTML = newsubt;
                    nodeTTP.innerHTML = xmlseri.serializeToString(spanebuttd);
                    xmlDoc.getElementsByTagName("tt:div")[0].appendChild(nodeTTP)
                };
                this.emptyAutoSubtitles = true;
                this.autosubtitlesfile = xmlDoc;
                this.defaultdocument = this.autosubtitlesfile.cloneNode(true);
            }
        },

        _updateDefaultDocument: function () {

            var xmlDoc = this.defaultdocument.cloneNode(true);
            xmlseri = new XMLSerializer();
            var edited = 0; var accepted = 0; var viewed = 0; var modified = 0; var conflict = 0;
            var subTotalNumber = this.length;
            if (xmlDoc.getElementsByTagName('tt:div')[0]) {
                xmlDoc.getElementsByTagName('tt:div')[0].innerHTML = ""

                idsReject = [];
                for (i = 0; i < this.defaultdocument.getElementsByTagName("tt:div")[0].children.length; i++) {
                    idsReject.push([this.defaultdocument.getElementsByTagName("tt:div")[0].children[i].getAttribute('xml:id'), this.defaultdocument.getElementsByTagName("tt:div")[0].children[i].getAttribute('conflict')]);
                }

                //Loop iterator to go through all the Subtitle Box models and
                //"parse" them to fill the new XML that will be outputted
                for (i = 0; i < this.length; i++) {
                    //Create a new p element (corresponding to EBUTTD subtitle)
                    var nodeTTP = xmlDoc.createElement("tt:p");
                    //Fill the necessary data to interpret this subtitles by our plugin
                    nodeTTP.setAttribute("xml:id", this.at(i).id);
                    nodeTTP.setAttribute("region", this.at(i).get('region'));
                    nodeTTP.setAttribute("begin", this._msToDotTime(this.at(i).get('begin')));
                    nodeTTP.setAttribute("end", this._msToDotTime(this.at(i).get('end')));

                    //Check and add attributes to the items depending on their status
                    if (this.isLastWorked(this.at(i))) {
                        nodeTTP.setAttribute("lastWorked", true);
                    }
                    if (this.isAccepted(this.at(i))) {
                        nodeTTP.setAttribute("accepted", true);
                        accepted++;
                    }
                    if (this.isEdited(this.at(i))) {
                        nodeTTP.setAttribute("edited", true);
                        edited++;
                    }
                    if (this.isOnCourse(this.at(i))) {
                        nodeTTP.setAttribute("editionOnCourse", true);
                    }

                    if (this.reviewerActive) {
                        if (this.isReviewerEdited(this.at(i))) {
                            nodeTTP.setAttribute("reviewerEdited", true);
                            modified++;
                        }
                        if (this.isConflict(this.at(i))) {
                            nodeTTP.setAttribute("conflict", true);
                            conflict++;
                        }

                    } else {
                        if (this.isViewed(this.at(i))) {
                            nodeTTP.setAttribute("viewed", true);
                            viewed++;
                        }

                        entryFound = idsReject.find(obj => obj[0] == nodeTTP.getAttribute('xml:id'));

                        if (entryFound && entryFound[1]) {
                            nodeTTP.setAttribute("conflict", true);
                            conflict++;
                        }

                    }

                    if (this.at(i).get('dualText')) {
                        var spanebuttd = XMLParser.parseFromString(this.at(i).get('ebuttText').trim(), "application/xml");
                        var spanebuttd2 = spanebuttd.cloneNode(true);
                        var newsubt = _.escape(this.at(i).get('newsubt'));
                        var newsubt2 = _.escape(this.at(i).get('newsubt2'));
                        spanebuttd.getElementsByTagName('tt:span')[0].innerHTML = newsubt;
                        spanebuttd2.getElementsByTagName('tt:span')[0].innerHTML = newsubt2;
                        var elements = "\n" + xmlseri.serializeToString(spanebuttd) + "\n<tt:br/>\n" + xmlseri.serializeToString(spanebuttd2) + "\n";
                        elements = elements.split('xmlns:tt="http://www.w3.org/ns/ttml"').join("");
                    } else {

                        var spanebuttd = XMLParser.parseFromString(this.at(i).get('ebuttText').trim(), "application/xml");
                        var newsubt = _.escape(this.at(i).get('newsubt'));
                        spanebuttd.getElementsByTagName('tt:span')[0].innerHTML = newsubt;
                        var elements = xmlseri.serializeToString(spanebuttd);
                        elements = elements.split('xmlns:tt="http://www.w3.org/ns/ttml"').join("");
                    }

                    //Subtitle box can be Accepted, Edited, or non-edited/accepted. The following block
                    //adds the corresponding attribute to be able to render the percentages                   
                    //Fill the XMLDocument with the new p tag, and jump to next iteration
                    nodeTTP.innerHTML = elements;
                    xmlDoc.getElementsByTagName("tt:div")[0].appendChild(nodeTTP);
                };
                this._updatePercentages(viewed, edited, accepted, conflict, modified, subTotalNumber, this.reviewerActive)

                //Fill the CCMA metadata in the EBUTTD
                if (!xmlDoc.getElementsByTagName("ebuttm:ccmaMetadata")[0]) {
                    var ccmaNode = xmlDoc.createElement("ebuttm:ccmaMetadata");

                } else {
                    var ccmaNode = xmlDoc.getElementsByTagName("ebuttm:ccmaMetadata")[0];
                }
                ccmaNode.setAttribute('easytv-edited', edited);
                ccmaNode.setAttribute('easytv-accepted', accepted);

                //Synopsis and Title status update Header                                
                ccmaNode.setAttribute('titleAccepted', this.titleAccepted)
                ccmaNode.setAttribute('synopsisAccepted', this.synopsisAccepted)
                ccmaNode.setAttribute('titleEdited', this.titleEdited)
                ccmaNode.setAttribute('synopsisEdited', this.synopsisEdited)

                //Handling conflict. If reviewer, save models data. If editor, don't change defaultdocument data.
                if (this.reviewerActive) {
                    ccmaNode.setAttribute('titleConflict', this.titleConflictStatus)
                    ccmaNode.setAttribute('synopsisConflict', this.synopsisConflictStatus)
                } else {
                    if (this.defaultdocument.getElementsByTagName("ebuttm:ccmaMetadata")[0]) {
                        ccmaNode.setAttribute('titleConflict', this.defaultdocument.getElementsByTagName("ebuttm:ccmaMetadata")[0].getAttribute('titleConflict'));
                        ccmaNode.setAttribute('synopsisConflict', this.defaultdocument.getElementsByTagName("ebuttm:ccmaMetadata")[0].getAttribute('synopsisConflict'));
                    } else {
                        ccmaNode.setAttribute('titleConflict', this.titleConflictStatus)
                        ccmaNode.setAttribute('synopsisConflict', this.synopsisConflictStatus)
                    }

                };

                xmlDoc.getElementsByTagName("tt:metadata")[0].appendChild(ccmaNode);

                //change the default document with the newly generated XMLdocument
                this.defaultdocument = xmlDoc;

                this.checkDocumentReady();
                accepted == this.length ? this.subtitlesDone = true : this.subtitlesDone = false;
                this._enableFinish();
            }
        },

        checkDocumentReady: function () {
            xmlseri = new XMLSerializer();
            if (this.taskstate == "AwaitingForEdition") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.auto_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }
            if (this.taskstate == "OnEdition") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.translated_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }
            if (this.taskstate == "onEditionSaved") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.translated_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }
            if (this.taskstate == "Edited") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.translated_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }

            if (this.taskstate == "AwaitingForRevision") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.translated_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }
            if (this.taskstate == "OnRevision") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.translated_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }
            if (this.taskstate == "OnRevisionSaved") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.translated_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }
            if (this.taskstate == "Rejected") {
                if (this._xmlNameSpaceRemover(xmlseri.serializeToString(this.defaultdocument)) == this.jsondata.translated_text) {
                    this.isWorked = false;
                } else {
                    this.isWorked = true;
                }
            }
            return this.isWorked;
        },

        //getDocument function to retrieve the last changes on the subtitles
        getDefaultDocument: function () {
            this._updateDefaultDocument();
            return this.defaultdocument;
        },

        //Change the percentages of the model and triggers an event to be listened by the view-model
        _updatePercentages: function (viewed, edited, accepted, conflict, modified, subTotalNumber, isReviewer) {
            this.editedNum = edited;
            this.conflictNum = conflict;
            this.modifiedNum = modified;
            this.acceptedNum = accepted;
            this.viewedNum = viewed;
            this.totalNum = edited + accepted;
            edited = edited / (this.length) * 100; this.editedPerc = edited.toFixed(2);
            accepted = accepted / (this.length) * 100; this.acceptedPerc = accepted.toFixed(2);
            viewed = viewed / (this.length) * 100; this.viewedPerc = viewed.toFixed(2);
            modified = modified / (this.length) * 100; this.modifiedPerc = modified.toFixed(2);
            conflict = conflict / (this.length) * 100; this.conflictPerc = conflict.toFixed(2);
            this.totalPerc = edited + accepted;
            this.totalPerc = this.totalPerc.toFixed(2);
            var changePercObj = {
                editedNum: this.editedNum,
                editedPerc: this.editedPerc,
                acceptedNum: this.acceptedNum,
                acceptedPerc: this.acceptedPerc,
                totalNum: this.totalNum,
                totalPerc: this.totalPerc,
                viewedNum: this.viewedNum,
                viewedPerc: this.viewedPerc,
                modifiedNum: this.modifiedNum,
                modifiedPerc: this.modifiedPerc,
                conflictNum: this.conflictNum,
                conflictPerc: this.conflictPerc,
                reviewerActive: isReviewer,
                subTotalNumber: subTotalNumber,
            }
            this.trigger('changePercentages', changePercObj);
        },

        /* #region Helpers */

        _xmlNameSpaceRemover: function (XMLDocument) {
            return this._replaceAll(XMLDocument, 'xmlns:tt=""', '')
        },

        _msToDotTime: function (time) {
            var HH = Math.floor(time / 3600000);
            var MM = Math.floor(time / 60000) - HH * 60;
            var ss = Math.floor(time / 1000) - HH * 3600 - MM * 60;
            var mili = parseInt((time - HH * 3600000 - MM * 60000 - ss * 1000));

            return this._lpad(HH.toString(), 2) + ':' + this._lpad(MM.toString(), 2) + ':' + this._lpad(ss.toString(), 2) + '.' + this._lpad(mili.toString(), 3)
        },
        _rpad: function (padString, length) {
            var str = padString;
            while (str.length < length)
                var str = str + "0";
            return str;
        },
        _lpad: function (padString, length) {
            var str = padString;
            while (str.length < length)
                var str = "0" + str;
            return str;
        },

        _timeToMs: function (time) {
            var splittedTime = time.split(":");
            var ms = +splittedTime[0] * 3600 + +splittedTime[1] * 60 + +splittedTime[2] + +("0." + this._rpad(splittedTime[3], 3));
            return ms
        },

        isNullOrWhitespace: function (input) {
            return (typeof input === 'undefined' || input == null)
                || input == "";
        },
        _replaceAll: function (str, find, replace) {
            if (!(str == null)) {
                return str.replace(new RegExp(find, 'g'), replace);
            };
        },

        _checkRTLLanguages: function () {
            if (this.jsondata.language_target == 'ar') {
                this.models.forEach(function (item, index) {
                    item.set('isRTL', true)
                });
                this.modalTitleTemplateModel.set('isRTL', true);
            }
        },

        _enableFinish: function () {
            this.titleAccepted && this.synopsisAccepted && this.subtitlesDone ? this.trigger('enableFinish', true) : this.trigger('enableFinish', false)
        },

        _updateTitleAndSynopsis: function (ev) {
            this.translatedTitle = ev.get('translatedTitle');
            this.translatedSynopsis = ev.get('translatedSynopsis');
            this.translatedTitle == this.jsondata.auto_title ? this.titleEdited = false : this.titleEdited = true
            this.translatedSynopsis == this.jsondata.auto_synopsis ? this.synopsisEdited = false : this.synopsisEdited = true
            this._updateDefaultDocument();
        },
        _checkTitleAndSynopsis: function (ev) {
            ev.get('titleAccepted') ? this.titleAccepted = ev.get('titleAccepted') : this.titleAccepted = false;
            ev.get('synopsisAccepted') ? this.synopsisAccepted = ev.get('synopsisAccepted') : this.synopsisAccepted = false;
            ev.get('titleConflict') ? this.titleConflictStatus = ev.get('titleConflict') : this.titleConflictStatus = false;
            ev.get('synopsisConflict') ? this.synopsisConflictStatus = ev.get('synopsisConflict') : this.synopsisConflictStatus = false;
            this._updateDefaultDocument()
        },
        _retrieveTitleAndSynopsis: function (subtitlesfile) {
            var ccmaNode = subtitlesfile.getElementsByTagName("ebuttm:ccmaMetadata")[0];

            (ccmaNode.getAttribute('titleEdited') == "true") && !(ccmaNode.getAttribute('titleAccepted') == "true") ?
                this.modalTitleTemplateModel.set({ titleOnCourse: true }, { silent: true }) :
                this.modalTitleTemplateModel.set({ titleOnCourse: false }, { silent: true });
            (ccmaNode.getAttribute('synopsisEdited') == "true") && !(ccmaNode.getAttribute('synopsisAccepted') == "true") ?
                this.modalTitleTemplateModel.set({ synopsisOnCourse: true }, { silent: true }) :
                this.modalTitleTemplateModel.set({ synopsisOnCourse: false }, { silent: true });

            this.modalTitleTemplateModel.set({
                titleAccepted: ccmaNode.getAttribute('titleAccepted') == "true",
                titleEdited: ccmaNode.getAttribute('titleEdited') == "true",
                titleConflict: ccmaNode.getAttribute('titleConflict') == "true" && ccmaNode.getAttribute('titleAccepted') == "false",
                titleReviewerEdited: ccmaNode.getAttribute('titleReviewerEdited') == "true",

                synopsisAccepted: ccmaNode.getAttribute('synopsisAccepted') == "true",
                synopsisEdited: ccmaNode.getAttribute('synopsisEdited') == "true",
                synopsisConflict: ccmaNode.getAttribute('synopsisConflict') == "true" && ccmaNode.getAttribute('synopsisAccepted') == "false",
                synopsisReviewerEdited: ccmaNode.getAttribute('synopsisReviewerEdited') == "true",
            });
            this._checkTitleAndSynopsis(this.modalTitleTemplateModel)
            this._updateTitleAndSynopsis(this.modalTitleTemplateModel)
        },

        _setTitleAndDescriptionDefault: function () {
            this.titleEdited = false
            this.synopsisEdited = false;
            this.titleAccepted = false;
            this.synopsisAccepted = false;
            this.titleConflictStatus = false;
            this.synopsisConflictStatus = false;
            this.titleReviewerEdited = false;
            this.synopsisReviewerEdited = false;
            this.modalTitleTemplateModel.set({
                titleEdited: this.titleEdited,
                synopsisEdited: this.synopsisEdited
            })
        },

        /* #region Checker functions */
        isOriginalLoaded: function () {
            return this.loadedoriginal;
        },
        isAutoLoaded: function () {
            return this.loadedautomatic;
        },
        isAccepted: function (modelElement) {
            return modelElement.get('accepted');
        },
        isEdited: function (modelElement) {
            return modelElement.get('edited');
        },
        isViewed: function (modelElement) {
            return modelElement.get('viewed');
        },
        isLastWorked: function (modelElement) {
            return modelElement.get('lastWorked');
        },
        isReviewerEdited: function (modelElement) {
            return modelElement.get('reviewerEdited');
        },
        isConflict: function (modelElement) {
            return modelElement.get('conflict');
        },
        isOnCourse: function (modelElement) {
            return modelElement.get('editionOnCourse');
        },

        /* #region Send to server functions */
        prepareObject: function (XMLdocument, isFinish, silentSave, isRefuse) {
            var preparedObjectToSend = {}
            preparedObjectToSend['job_id'] = this.json.job_id
            if (isFinish) {
                preparedObjectToSend['action'] = 'finish'
            } else {
                if (silentSave) {
                    preparedObjectToSend['action'] = 'saveIgnoreModal';
                } else {
                    if (isRefuse) {
                        preparedObjectToSend['action'] = 'refuse';
                    } else {
                        preparedObjectToSend['action'] = 'save';
                    }
                }
            }
            if (this.reviewerActive) {
                preparedObjectToSend['data'] = {
                    translated_text: XMLdocument,
                    translated_title: this.translatedTitle,
                    translated_synopsis: this.translatedSynopsis,
                    viewed_percent_reviewer: this.viewedPerc,
                    edited_percent_reviewer: this.editedPerc,
                    validated_percent_reviewer: this.acceptedPerc,

                }
            } else {
                preparedObjectToSend['data'] = {
                    translated_text: XMLdocument,
                    translated_title: this.translatedTitle,
                    translated_synopsis: this.translatedSynopsis,
                    viewed_percent_editor: this.viewedPerc,
                    edited_percent_editor: this.editedPerc,
                    validated_percent_editor: this.acceptedPerc,
                }
            }
            return preparedObjectToSend
        },

        sendToSave: function () {
            var XMLToSend = this.getDefaultDocumentToSave().cloneNode(true);
            var cleanedXMLToSend = this._replaceAll(XMLToSend.documentElement.outerHTML, 'xmlns:tt=""', '');
            var preparedObject = this.prepareObject(cleanedXMLToSend, false, false, false)
            this.trigger('sendToSave', preparedObject);
        },

        sendToRefuse: function () {
            var XMLToSend = this.getDefaultDocumentToSave().cloneNode(true);
            var cleanedXMLToSend = this._replaceAll(XMLToSend.documentElement.outerHTML, 'xmlns:tt=""', '');
            var preparedObject = this.prepareObject(cleanedXMLToSend, false, false, true)
            this.trigger('sendToRefuse', preparedObject);
        },

        sendToFinish: function () {
            this.modalTitleTemplateModel.set({
                titleAccepted: false,
                synopsisAccepted: false,
            });

            if (!this.reviewerActive && (this.get('credits').get('newsubt2') === "Reviewer Name" || this.get('credits').get('newsubt2').trim() === "")) {
                this.remove("credits", { silent: true });
            }
            var XMLToSend = this.getDefaultDocument().cloneNode(true);
            var XMLToSend = this.setOutputLanguage(XMLToSend);

            if (this.reviewerActive) {
                var escapedXMLToSend = this.cleanDocumentTags(XMLToSend, false);
            } else {
                var escapedXMLToSend = this.cleanDocumentTags(XMLToSend, true);
            }
            var preparedObject = this.prepareObject(escapedXMLToSend, true, false, false)
            this.trigger('sendToFinish', preparedObject);
        },

        sendToReject: function (ev) {
            rejectObject = {
                job_id: this.json.job_id,
                reason: ev,
            }
            this.trigger('sendToReject', rejectObject);
        },

        silentSave: function () {
            var XMLToSend = this.getDefaultDocument().cloneNode(true);
            var cleanedXMLToSend = this._replaceAll(XMLToSend.documentElement.outerHTML, 'xmlns:tt=""', '');
            var preparedObject = this.prepareObject(cleanedXMLToSend, false, true, false)
            this.trigger('sendToSave', preparedObject);
        },

        finishSession: function () {
            this.trigger('finishSession');
        },

        setOutputLanguage: function (XMLfile) {

            switch (this.translatedLanguage) {
                case "English":
                    langCode = 'en-GB';
                    break;
                case "Amazigh":
                    langCode = 'ber-MA';
                    break;
                case "Arabic":
                    langCode = 'ar-MA';
                    break;
                case "Spanish":
                    langCode = 'es-ES';
                    break;
                case "Catalan":
                    langCode = 'ca-ES';
                    break;
                default:
                    langCode = this.jsondata.language_target;
            }
            XMLfile.getElementsByTagName('tt:tt')[0].setAttribute('xml:lang', langCode);
            return XMLfile;
        },

        cleanDocumentTags: function (XMLfile, isEditor) {
            var ttpNodes = XMLfile.getElementsByTagName('tt:p');
            if (!isEditor) {
                var ccmametadataNode = XMLfile.getElementsByTagName('ebuttm:ccmaMetadata')[0]
                XMLfile.getElementsByTagName('tt:metadata')[0].removeChild(ccmametadataNode);
            }

            for (i = 0; i < ttpNodes.length; i++) {
                if (ttpNodes[i].hasAttribute('accepted')) ttpNodes[i].removeAttribute('accepted');
                if (ttpNodes[i].hasAttribute('viewed')) ttpNodes[i].removeAttribute('viewed');
                if (ttpNodes[i].hasAttribute('lastWorked')) ttpNodes[i].removeAttribute('lastWorked');
                if (ttpNodes[i].hasAttribute('editionOnCourse')) ttpNodes[i].removeAttribute('editionOnCourse');
                if (!isEditor) {
                    if (ttpNodes[i].hasAttribute('reviewerEdited')) ttpNodes[i].removeAttribute('reviewerEdited');
                    if (ttpNodes[i].hasAttribute('conflict')) ttpNodes[i].removeAttribute('conflict');
                    if (ttpNodes[i].hasAttribute('edited')) ttpNodes[i].removeAttribute('edited');

                }
            }
            return this._replaceAll(XMLfile.documentElement.outerHTML, 'xmlns:tt=""', '');
        },


        _getMostUsedStyle: function (subt) {
            var styleIds = {}
            styleList = this._getStylesList(subt);
            for (j = 0; j < styleList.length; j++) {
                styleIds[styleList[j]] = 0;
            }

            var styles = subt.getElementsByTagName('tt:span');
            var stylesUsed = [];
            for (j = 0; j < styles.length; j++) {
                stylesUsed[j] = styles[j].getAttribute('style');
            };
            for (var id in styleIds) {
                styleIds[id] = stylesUsed.filter(x => x == id).length;
            };

            return Object.keys(styleIds).reduce(function (a, b) { return styleIds[a] > styleIds[b] ? a : b });
        },

        _getStylesList: function (subt) {
            var styles = subt.getElementsByTagName('tt:styling')[0].children;
            var style_ids = [];
            for (j = 0; j < styles.length; j++) {
                style_ids[j] = styles[j].getAttribute('xml:id');
            }
            return style_ids;
        },

        _addCredits: function () {
            if (!this.reviewerActive && !(this.defaultdocument.getElementsByTagName('tt:p')[0].getAttribute('xml:id') == 'credits')) {
                if (!this.get("credits")) {
                    credits = this.at(0).clone();
                    credits.id = "credits";
                    credits.set({
                        "begin": 0,
                        "end": 5000,
                        "textAuto": this._getCreditPhrase(this.translatedLanguage),
                        "textAuto2": "",
                        "textContent": "",
                        "newsubt": this._getCreditPhrase(this.translatedLanguage),
                        "newsubt2": "",
                        "id": "credits",
                        "region": "rcredits",
                        "dualText": true,
                        "style": "scredits",
                        "ebuttText": "<tt:span style=\"scredits\">Reviewer Name</tt:span>",
                        "subnumber": 1,
                    });
                    this.unshift(credits);
                }
            } else {
                if (this.defaultdocument.getElementsByTagName('tt:p')[0] !== undefined) {
                    if (this.defaultdocument.getElementsByTagName('tt:p')[0].getAttribute('xml:id') == 'credits') {
                        credits = this.at(0).clone();
                        credits.id = "credits";
                        credits.set({
                            "begin": 0,
                            "end": 5000,
                            "textAuto": this._getCreditPhrase(this.translatedLanguage),
                            "textAuto2": "",
                            "textContent": "",
                            "newsubt": this._getCreditPhrase(this.translatedLanguage),
                            "newsubt2": "",
                            "id": "credits",
                            "region": "rcredits",
                            "dualText": true,
                            "style": "scredits",
                            "ebuttText": "<tt:span style=\"scredits\">Reviewer Name</tt:span>",
                            "subnumber": 1,
                        });
                        this.unshift(credits);
                    }
                }
            }

        },

        _removeCredits: function () {
            this.remove("credits", { silent: true });
            this.trigger("creditsRemoved");
        },

        _setCreditsRegionStyle: function () {
            //clone region and define parameters
            var creditsRegion = this.subtitlesfile.getElementsByTagName('tt:layout')[0].children[0].cloneNode(true);
            creditsRegion.setAttribute('xml:id', "rcredits");
            creditsRegion.setAttribute('tts:origin', "2.50% 2.50%");
            creditsRegion.setAttribute('tts:extent', "95.00% 12.00%");
            this.subtitlesfile.getElementsByTagName('tt:layout')[0].appendChild(creditsRegion);

            //clone style and define parameters
            var creditsStyle = this.subtitlesfile.getElementsByTagName('tt:styling')[0].children[0].cloneNode(false);
            for (var i = creditsStyle.attributes.length - 1; i >= 0; i--) {
                creditsStyle.removeAttribute(creditsStyle.attributes[i].name);
            }
            attributes = {
                'xml:id': "scredits",
                "tts:fontStyle": "normal",
                'tts:fontWeight': "normal",
                'tts:textDecoration': "none",
                'tts:color': "#FFFFFF",
                'tts:backgroundColor': "#000000",
                "tts:fontFamily": "Tiresias",
                "tts:textAlign": "center"
            };
            for (var key in attributes) {
                creditsStyle.setAttribute(key, attributes[key]);
            }
            this.subtitlesfile.getElementsByTagName('tt:styling')[0].appendChild(creditsStyle);


        },

        _getCreditPhrase: function (lang) {
            phrases = {
                'Catalan': 'Subtítols amb la col·laboració de',
                'Spanish': 'Subtítulos con la colaboración de',
                'Amazigh': 'Subtitles with the collaboration of',
                'Arabic': 'ترجمات بالتعاون مع',
                'English': 'Subtitles with the collaboration of'
            };

            return phrases[lang] ? phrases[lang] : phrases['English'];
        },

    }, {
        getInstance: function (model, options) {
            instance = instance ? instance : new SubtitlesBoxCollection(model, options);
            return instance;
        }, destroyInstance: function () {
            instance = null;
        }
    });

    return SubtitlesBoxCollection;
});
