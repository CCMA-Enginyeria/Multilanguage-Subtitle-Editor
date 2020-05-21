/*globals
    define, _, $, AppRouter, console, jQuery, require
*/

define([],
    function() {
        /*-
            BUG: al comprimir es obligatorio que exista el resto de JS testengine.js
        -*/
        return {
            tests: [],
            launchingTests: [],
            testDiv: null,
            launch: function(tests) {
                this.embedDiv();
                this.tests = _.clone(tests);
                this.launchingTests = _.clone(tests);
                if (window.location.hash.indexOf('#debug') === 0) {
                    var hash = window.location.hash.split('/'),
                        startTest;
                    if (hash.length > 1) {
                        startTest = parseInt(hash[1], 10);
                        console.log(startTest);
                        this.launchingTests.splice(0, startTest);
                    }
                }
                this.launchNextTest();
            },
            activeAjaxLogger: function() {
                this.ajaxUrlsCatched = [];
                if (this.ajaxLoggerActive) {
                    return;
                }
                this.ajaxLoggerActive = true;
                $.ajaxPrefilter(_.bind(function(options) {
                    this.ajaxUrlsCatched.push({
                        url: options.url,
                        options: options
                    });
                }, this));
            },
            embedDiv: function() {
                if ($('#testenginediv').length > 0) {
                    return;
                }
                this.testDiv = document.createElement('div');
                this.testDiv.id = 'testenginediv';
                this.testDiv.style.padding = "5%";
                this.testDiv.style.position = "fixed";
                this.testDiv.style.overflow = "auto";
                this.testDiv.style.left = '45%';
                this.testDiv.style.top = '0%';
                this.testDiv.style.width = '52%';
                this.testDiv.style.height = '100%';
                this.testDiv.style.backgroundColor = 'white';
                this.testDiv.style.opacity = '0.8';
                this.testDiv.style.zIndex = '10000';
                this.testDiv.style.fontSize = '16px';
                $('body').append(this.testDiv);
            },
            getStyleForState: function(state) {
                var style = {};
                switch (state) {
                    case 'success':
                        style = {
                            'color': 'green'
                        };
                        break;
                    case 'error':
                        style = {
                            'color': 'red'
                        };
                        break;
                    case 'warning':
                        style = {
                            'color': 'orange'
                        };
                        break;
                    case 'comment':
                        style = {
                            'font-size': '1.5em',
                            'color': 'black',
                            'font-weight': 'bold'
                        };
                        break;
                }
                return _.map(style, function(v, k) {
                    return k + ': ' + v;
                }).join(';');
            },
            _printLine: function(text, status, cls) {
                text = text || '';
                cls = cls || '';
                this.testDiv.innerHTML = '<div class="' + cls + '" style="' + this.getStyleForState(status) + '"> ' + text + '</div>' + this.testDiv.innerHTML;
            },
            printComment: function(text, cls) {
                this._printLine(text, 'comment', cls);
            },
            printSuccess: function(text, cls) {
                this._printLine(text, 'success', cls);
            },
            printError: function(text, cls) {
                this._printLine(text, 'error', cls);
            },
            printTestFinishedSummary: function(test) {
                var text;
                if (test.exceptionLaunched) {
                    text = '<strong>' + test.name + '</strong> : not finished by Exception ' + test.exception + ' in' + test.totalTime + 'ms';
                } else if (test.timeoutLaunched) {
                    text = '<strong>' + test.name + '</strong> : not finished by Timeout ' + test.totalTime + 'ms';
                } else {
                    text = '<strong>' + test.name + '</strong> : ' + test.totalAsserts + ' asserts, ' + test.assertsSuccess + ' ok, ' + test.assertsFailed + ' ko in ' + test.totalTime + 'ms';
                }
                this._printLine(text, test.status, test.status);
                this._printLine('<br/>');
            },
            printTestsFinishedSummary: function(tests) {
                var summary = _.reduce(tests, function(summary, test) {
                    summary.total += 1;
                    if (test.status === 'error') {
                        summary.error += 1;
                    } else if (test.status === 'warning') {
                        summary.warning += 1;
                    } else if (test.status === 'success') {
                        summary.success += 1;
                    }
                    summary.totalTime += test.totalTime;
                    return summary;
                }, {
                    status: 'warning',
                    total: 0,
                    error: 0,
                    success: 0,
                    warning: 0,
                    totalTime: 0
                });
                if (summary.error > 0) {
                    summary.status = 'error';
                } else if (summary.warning > 0) {
                    summary.status = 'warning';
                } else if (summary.success > 0) {
                    summary.status = 'success';
                }
                //this.printTestFinishedSummary(summary);
                text = '<strong>SUMMARY</strong> : ' + summary.total + ' tests, ' + summary.success + ' ok, ' + summary.error + ' ko, ' + summary.warning + ' empty in ' + summary.totalTime + 'ms';
                this._printLine(text, summary.status, 'summary summary-' + summary.status);
                this.testResults = [];
            },
            launchNextTest: function() {
                if (this.launchingTests.length > 0) {
                    var test = this.launchingTests.splice(0, 1)[0],
                        testIndex = this.tests.indexOf(test),
                        params = this.getParamNames(test),
                        testEngine = this;

                    this.currentTest = {
                        name: test.name,
                        assertsSuccess: 0,
                        assertsFailed: 0,
                        totalAsserts: 0,
                        startTime: new Date().getTime(),
                        initalize: function(test, params, testIndex) {
                            this.intervals = [];
                            this.timeouts = [];
                            window.onerror = _.bind(function(errorMsg, url, lineNumber) {
                                clearTimeout(this.timeout);
                                this.exceptionLaunched = true;
                                this.exception = 'Error on line ' + lineNumber + ' ' + url + ' with msg: ' + errorMsg;
                                this.onFinished();
                            }, this);
                            this.testFunction = test;
                            if (params) { //Async Test
                                this.timeoutLaunched = false;
                                this.timeout = setTimeout(_.bind(function() {
                                    this.timeoutLaunched = true;
                                    this.onFinished();
                                }, this), 30000);
                                this.done = _.bind(function() {
                                    clearTimeout(this.timeout);
                                    if (!this.timeoutLaunched) {
                                        this.onFinished();
                                    }
                                }, this);
                                this.execute(this.done, this.timeout, testIndex);
                            } else {
                                this.execute();
                                this.onFinished();
                            }
                        },
                        onFinished: function() {
                            window.onerror = function() {};
                            _.each(this.intervals, function(interval) {
                                clearInterval(interval);
                            });
                            _.each(this.timeouts, function(timeout) {
                                clearTimeout(timeout);
                            });

                            testEngine.testResults = testEngine.testResults || [];
                            this.endTime = new Date().getTime();
                            this.totalTime = this.endTime - this.startTime;
                            this.status = 'warning';
                            if (this.assertsFailed > 0 || this.timeoutLaunched === true || this.exceptionLaunched === true) {
                                this.status = 'error';
                            } else if (this.assertsSuccess > 0) {
                                this.status = 'success';
                            }
                            testEngine.printTestFinishedSummary(this);
                            testEngine.testResults.push(this);
                            setTimeout(_.bind(function() {
                                testEngine.launchNextTest();
                            }, this));
                        },
                        execute: function(done, timeoutVar, index) {
                            if (done) {
                                this.testFunction.call(testEngine, done, timeoutVar, testIndex);
                            } else {
                                this.testFunction.call(testEngine);
                            }
                        }
                    };

                    this.currentTest.initalize(test, params, testIndex);
                } else {
                    console.log(this.testResults);
                    this.printTestsFinishedSummary(this.testResults);
                }
            },
            STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
            getParamNames: function(func) {
                var funStr = func.toString();
                funStr = funStr.replace(this.STRIP_COMMENTS, '');
                return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
            },
            assert: function(value, expected, message) {
                var isOk = (_.isEqual(value, expected)),
                    text,
                    ex;
                this.currentTest.totalAsserts++;
                if (isOk) {
                    this.currentTest.assertsSuccess++;
                    this.printSuccess('Assert: ' + message + ' OK');
                } else {
                    this.currentTest.assertsFailed++;
                    this.printError('---- Value Expected: ' + JSON.stringify(expected));
                    this.printError('---- Value Received: ' + JSON.stringify(value));
                    this.printError('Assert: ' + message + ' KO');
                }
            },
            waitUntilEl: function(el, callback) {
                if(!_.isString(el)) {
                   
                    console.warn('waitUntilEl only supports el as string. Received '+ el);
                }
                this.waitUntilConditionAccomplished(function() {
                    return $(el).length > 0;
                }, callback);
            },
            waitUntilConditionAccomplished: function(conditionFunction, callback) {
                if(!_.isFunction(conditionFunction)) {
                    
                    console.warn('waitUntilConditionAccomplished only supports conditionFunction as function. Received '+ conditionFunction);
                }
                var timeOut = 0,
                    interval = setInterval(
                        _.bind(function() {
                            //console.log('TEST ' + timeOut);
                            timeOut = timeOut + 1;
                            if (conditionFunction()) {
                                clearInterval(interval);
                                //console.log('TRUE ' + timeOut);
                                callback.apply(this, [true]);
                            } else if (timeOut === 120) {
                                //console.log('FALSE ' + timeOut);
                                clearInterval(interval);
                                callback.apply(this, [false]);
                            }
                        }, this), 500);
                this.currentTest.intervals.push(interval);
            },
            findTest: function(testArray, testFunctionName) {
                return _.find(testArray,
                    _.bind(function(testFunction) {
                        return testFunction.name === testFunctionName;
                    }, this));
            },
            executeTestsFunctions: function(tests, finishCallback) {
                if (tests.length === 0) {
                    return finishCallback.call(this);
                }
                var currentTest = tests.shift(),
                    testFunction, 
                    isTestAsync;
                require([currentTest.file], _.bind(function(TestArray) {
                    testFunction = this.findTest(TestArray, currentTest.name);
                    if(testFunction) {
                        isTestAsync = !!this.getParamNames(testFunction);
                        if(isTestAsync) {
                            testFunction.call(this, _.bind(function() {
                                this.executeTestsFunctions(tests, finishCallback);
                            }, this));
                        } else {
                            testFunction.call(this);
                            executeTestsFunctions(tests, finishCallback);
                        }
                    }
                }, this));
            },
            checkAjaxCall: function(url, callback) {
                this.activeAjaxLogger();
                var timeOut = 0,
                    found = null,
                    interval = setInterval(
                        _.bind(function() {
                            //console.log('TEST ' + timeOut);
                            timeOut = timeOut + 1;
                            found = _.find(this.ajaxUrlsCatched, function(options) {
                                return options.url.match(url);
                            });

                            if (found) {
                                clearInterval(interval);
                                //console.log('TRUE ' + timeOut);
                                callback.apply(this, [found.options]);
                            } else if (timeOut === 120) {
                                //console.log('FALSE ' + timeOut);
                                clearInterval(interval);
                                callback.apply(this, [null]);
                            }
                        }, this), 500);
                this.currentTest.intervals.push(interval);
            }
        };

    });