define([], function () {
    var focusedBox = "tr.focus.subtitle-box-replaced-view"
    var focusedSimpleBox = "tr.focus.simple-subtitle-box-replaced-view"
    var video = '#my-video'
    var largeText = "This is the largest text you should encounter in a subtitle and will provoke a Large text conflict"
    var Subtitles = ".subtitle-box-replaced-view";
    var AcceptedBoxes = "tr.subtitle-box-replaced-view.accepted";
    var ConflictBoxes = "tr.subtitle-box-replaced-view.reject";
    var YellowBoxes = "tr.subtitle-box-replaced-view.yellow";

    var clickAcceptCheckBox = function (BoxToAccept) {
        BoxToAccept.find('.accept-action').click()
    };

    var doFocus = function (Element) {
        Element[0].children[0].click()
    };

    var doFocusRecursively = function (index, callback) {
        var el,
            total = $(".subtitle-box-replaced-view").length;
        if (index-10 > total) {
            return callback();
        }
        console.log(index);

        elementSelector = ".subtitle-box-replaced-view:eq(" + index + ")";
        this.waitUntilEl(elementSelector,function () {
                el = $(elementSelector);
                doFocus(el);
                this.waitUntilEl(elementSelector + ".focus",function (res) {
                        this.assert(res, true, 'La capsa ' + index + ' te focus');
                        if($('.subtitle-box-replaced-view:eq(' + index + '):not(.accepted)').length>0){
                            $(elementSelector + " .accept-subtitlebox-action").click();
                        }
                        this.waitUntilEl(elementSelector + ".accepted", function (res) {
                            this.assert(res, true, "La capsa de subtítol " + index + " ha estat acceptada i ha canviat d'estat a 'accepted'")
                            index++;
                            doFocusRecursively.call(this, index, callback);
                        });
                });
        })
    };

    return [
        function Global_checkErrorModals(done) {
            window.location.href = "#editor?userid=32435&token=fdskk2315dasbgfn&job=0013340"
            this.waitUntilEl("h5:contains(Job ID or credential doesn't exist)", function (res) {
                this.assert(res, true, "S'ha mostrat l'error de job correctament");
                $(".close-action")[0].click()
                done();
            });
        },

        function Editor_checkHeader(done) {
            window.location.href = "#editor?userid=user7&token=123456789&job=693"
            this.waitUntilEl("h1:contains(Subtitles Reviewer)", function (res) {
                this.assert(res, true, 'LA pàgina té h1');
                done();
            });
        },


        function Editor_checkInitialSubtitles(done) {
            this.waitUntilEl(".subtitle-box-replaced-view", function (res) {
                if ($(".subtitle-box-replaced-view").length > 1) this.assert(res, true, "La pàgina conte caixes de subtitols")
                else {
                    this.assert(res, true, "la pagina conté 1 subtítol");
                }
                this.waitUntilConditionAccomplished(() => ($(AcceptedBoxes).length == 0), function (res) {
                    this.assert(res, true, "No hi ha cap capsa amb accepted")
                    this.waitUntilConditionAccomplished(() => ($(ConflictBoxes).length == 0), function (res) {
                        this.assert(res, true, "No hi ha cap capsa amb conflict")
                        this.waitUntilConditionAccomplished(() => ($(YellowBoxes).length == 0), function (res) {
                            this.assert(res, true, "No hi ha cap capsa amb yellow")
                            done();
                        })
                    })
                })
            });
        },

        function Editor_checkInitialVideo(done) {
            //Mirar que hi ha un element de video
            //Mirar que no apareix la creueta conforme no s'ha pogut carregar el video per error "X"             
            this.waitUntilEl("video [src!='']", function (res) {
                this.assert(res, true, "Hi ha un element video amb un link carregat");
                done();
            });
        },

        function Editor_testBoxFocusSingleLine(done) {
            doFocus($(".subtitle-box-replaced-view:eq(2)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(2).focus", function (res) {
                this.assert(res, true, 'La capsa 2 te focus');
                done();
            });
        },

        function Editor_testBoxFocusDoubleLine(done) {
            doFocus($(".subtitle-box-replaced-view:eq(1)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(1).focus", function (res) {
                this.assert(res, true, 'La capsa 1 te focus');
                done();
            });
        },

        //Focus from collection de una capsa amb double line
        function Editor_testBoxFocusFromCollection(done) {
            doFocus($(".subtitle-box-replaced-view:eq(4)"));
            this.waitUntilEl(".subtitle-box-replaced-view:eq(4).focus", function (res) {
                this.assert(res, true, "La capsa 4 te focus")
                this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(4).focus", function (res) {
                    this.assert(res, true, 'Les capses de la col·lecció i el video concorden')
                    done();
                })

            })
            //Mirar que el begintime d'aquesta capsa concorda amb el temps on esta el video colocat
            //Mirar que e begintime de la capsa que esta focused en el timeline concorda amb el de simplesubtitle fet focus
            //Mirar que el subtitol renderitzat concorda amb el text dintre de la capsa

        },

        //Testejar per una capsa que tingui 2 linies
        function Editor_testSimpleBoxFocusFromCollection(done) {
            //S'ha d'agafar una capsa random unaltered de la coleccio de capses petites
            //S'ha de fer click a aquesta capsa
            //Mirar que aquesta capsa conte focus
            //Mirar que el begintime d'aquesta capsa concorda amb el temps on esta el video colocat
            //Mirar que el begintime de la capsa que esta focused en el timeline concorda amb el del subtitel fet focus
            //Mirar que el subtitol renderitzat concorda amb el text dintre de la capsa

            doFocus($(".simple-subtitle-box-replaced-view:eq(80)"));
            this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(80).focus", function (res) {
                this.assert(res, true, 'La capsa 80 te focus')

                var beginTimeSimpleBox = $('.simple-subtitle-box-replaced-view:eq(80).focus .on-click-box-action:eq(0) div:eq(0)').html()
                var beginTimeColleBox = $('.subtitle-box-replaced-view.focus .on-click-box-action:eq(0) .go-to-begin-action').html()
                var video = document.getElementById("my-video_html5_api");

                this.waitUntilConditionAccomplished(() => (beginTimeSimpleBox.split(':')[1] == Math.trunc(video.currentTime / 60)), function (res) {
                    this.assert(res, true, 'El begin time de la caixa simple concorda amb el currentTime del video')
                    this.waitUntilConditionAccomplished(() => (beginTimeSimpleBox == beginTimeColleBox), function (res) {
                        this.assert(res, true, 'beginTime Simple box concorda amb beginTime Collection box');
                        this.waitUntilConditionAccomplished(() => ($('.subtitle-line:eq(0)').html() == $('.subtitle-box-replaced-view:eq(80).focus .on-click-box-action:eq(2) div:eq(0)').html().trim()), function (res) {
                            this.assert(res, true, 'Concorden els textos del simple box, collection box i del video');
                            done();
                        });
                    });
                });
            });
        },

        function Editor_testVideoFocus(done) {
            //S'ha de setejar el temps del video a un número aleatori (dintre de les posibilitats del video)
            //Mirar que una capsa dintre de la col·lecció te focus i que aquesta capsa te begin/endtime dintre del temps del video
            //Mirar que una capsa dintre de la col·lecció SIMPLE te focus i que aquesta capsa te begin/endtime dintre del temps del video   
            doFocus($(".simple-subtitle-box-replaced-view:eq(2)"));
            this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(2).focus", function (res) {
                this.assert(res, true, 'La capsa 2 te focus')
                this.waitUntilConditionAccomplished(() => ($('.R-subtitle.focus .R-up .R-tcin').text().split(":")[2] == Math.trunc($('#my-video_html5_api')["0"].currentTime).toString()), function (res) {
                    this.assert(res, true, 'La capsa lateral coincieixamb el timing del video')
                    this.waitUntilConditionAccomplished(() => ($('.subtitle-box-replaced-view.focus .on-click-box-action .go-to-begin-action').text().split(":")[2] == Math.trunc($('#my-video_html5_api')["0"].currentTime).toString()), function (res) {
                        this.assert(res, true, 'La capsa inferior coincieixamb el timeing del video')
                        done();
                    });
                });
            });
        },

        function Editor_testVideoRunningFocus(done) {
            //S'ha d'agafar un temps aleatori amb <1min abans del final minim
            //S'ha de fer play al video
            //Mirar que el video esta corrent
            //Mirar que passat un temps s'han recorregut X subtitols
            $('#my-video_html5_api')["0"].currentTime = 400;
            this.waitUntilConditionAccomplished(() => ($('.simple-subtitle-box-replaced-view.focus .on-click-box-action:eq(0) div:eq(0)').html() == "0:6:40:000"), function (res) {
                this.assert(res, true, "El video es seteja be")
                $('#my-video_html5_api').trigger('play')
                this.waitUntilConditionAccomplished(() => ($('#my-video_html5_api')["0"].currentTime != 400), function (res) {
                    this.assert(res, true, "El video esta corrent")
                    this.waitUntilConditionAccomplished(() => ($('.simple-subtitle-box-replaced-view.focus .on-click-box-action:eq(0) div:eq(0)').html() == "0:6:48:840"), function (res) {
                        this.assert(res, true, "El video i els subtitols estan corrent")
                        done();
                    });
                });
            });
        },

        function Editor_changeSubtitleText(done) {
            doFocus($(".subtitle-box-replaced-view:eq(10)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(10).focus", function (res) {
                this.assert(res, true, "La capsa 10 te focus")
                doFocus($(".subtitle-box-replaced-view:eq(10)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(10).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, "Ha aparegut el input en la capsa focused")
                    $(".subtitle-box-replaced-view:eq(10) input").val("Soc una patata")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(10) input").val() == 'Soc una patata'), function (res) {
                        this.assert(res, true, "Cambiar el text del subtitol ha funcionat")
                        $(".subtitle-box-replaced-view:eq(10) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(10) input.proposed-modified-action").change()

                        doFocus($(".subtitle-box-replaced-view:eq(11)"))
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(10).yellow", function (res) {
                            this.assert(res, true, "La caixa de subtítol ha canviat d'estat a 'yellow'")
                            done();
                        });
                    });
                });
            });
        },

        function Editor_acceptSubtitleWithEdition(done) {
            $(".subtitle-box-replaced-view:eq(10) .accept-subtitlebox-action").click()
            this.waitUntilEl(".subtitle-box-replaced-view:eq(10).accepted", function (res) {
                this.assert(res, true, "La capsa de subtítol 10 ha estat acceptada i ha canviat d'estat a 'accepted'")
                done();
            });
        },

        function Editor_unAcceptSubtitleWithEdition(done) {
            $(".subtitle-box-replaced-view:eq(10) .accept-subtitlebox-action").click()
            this.waitUntilEl(".subtitle-box-replaced-view:eq(10):not(.accepted)", function (res) {
                this.assert(res, true, "La capsa de subtítol 10 ha estat desacceptada i ha canviat d'estat")
                done();
            });
        },

        function Editor_doubleLineFirstSubtitleChange(done) {
            doFocus($(".subtitle-box-replaced-view:eq(8)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(8).focus", function (res) {
                this.assert(res, true, 'La capsa 8 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(8)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(8).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(8) input:eq(0)").val("Yeah")
                    var textSecondInput = $(".subtitle-box-replaced-view:eq(8) input:eq(1)").text();
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) input:eq(0)").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la 8a capsa');
                        $(".subtitle-box-replaced-view:eq(8) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(8) input.proposed-modified-action").change()
                        $(".subtitle-box-replaced-view:eq(8) input:eq(0)").click()
                        doFocus($(".subtitle-box-replaced-view:eq(10)"));
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(10).focus", function (res) {
                            this.assert(res, true, 'La caps 10 te focus');
                            this.waitUntilEl(".subtitle-box-replaced-view:eq(8).yellow", function (res) {
                                this.assert(res, true, "La caixa de subtítol 8 ha canviat d'estat a 'yellow'")
                                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action:eq(0)").text() == "Yeah"), function (res) {
                                    this.assert(res, true, "El text de la caixa 8 primer input ha canviat");
                                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action").css("color") == "rgb(0, 147, 61)"), function (res) {
                                        this.assert(res, true, "El text de la caixa 8 sha posat en verd");
                                        this.waitUntilConditionAccomplished(() => (textSecondInput == $(".subtitle-box-replaced-view:eq(8) .proposed-modified-action:eq(1)").text()), function (res) {
                                            this.assert(res, true, "El text de la segona caixa no sha modificat");
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_doubleLineSecondSubtitleChange(done) {
            doFocus($(".subtitle-box-replaced-view:eq(6)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(6).focus", function (res) {
                this.assert(res, true, 'La capsa 6 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(6)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(6).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(6) input:eq(1)").val("Yeah")
                    var textFirstInput = $(".subtitle-box-replaced-view:eq(6) input:eq(0)").val();
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(6) input:eq(1)").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la primera capsa');
                        $(".subtitle-box-replaced-view:eq(6) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(6) input.proposed-modified-action").change()
                        doFocus($(".subtitle-box-replaced-view:eq(9)"));
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(9).focus", function (res) {
                            this.assert(res, true, 'La caps 9 te focus');
                            this.waitUntilEl(".subtitle-box-replaced-view:eq(6).yellow", function (res) {
                                this.assert(res, true, "La caixa de subtítol 6 ha canviat d'estat a 'yellow'")
                                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(6) .proposed-modified-action:eq(1)").text() == 'Yeah'), function (res) {
                                    this.assert(res, true, "El text de la caixa 6 primer input ha canviat");
                                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(6) .proposed-modified-action").css("color") == "rgb(0, 147, 61)"), function (res) {
                                        this.assert(res, true, "El text de la caixa 6 sha posat en verd");
                                        this.waitUntilConditionAccomplished(() => (textFirstInput == $(".subtitle-box-replaced-view:eq(6) .proposed-modified-action:eq(0)").text()), function (res) {
                                            this.assert(res, true, "El text de la primera caixa no sha modificat");
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_doubleLineBothSubtitleChange(done) {
            doFocus($(".subtitle-box-replaced-view:eq(8)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(8).focus", function (res) {
                this.assert(res, true, 'La capsa 8 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(8)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(8).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(8) input:eq(0)").val("Yeah")
                    $(".subtitle-box-replaced-view:eq(8) input:eq(1)").val("Yeeeeeah")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) input:eq(0)").val() == 'Yeah'), function (res) {
                        this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) input:eq(1)").val() == 'Yeeeeeah'), function (res) {
                            this.assert(res, true, 'Sha modificat les dues capses');
                            $(".subtitle-box-replaced-view:eq(8) input.proposed-modified-action").trigger('input')
                            $(".subtitle-box-replaced-view:eq(8) input.proposed-modified-action").change()
                            doFocus($(".subtitle-box-replaced-view:eq(13)"));
                            this.waitUntilEl(".subtitle-box-replaced-view:eq(13).focus", function (res) {
                                this.assert(res, true, 'La caps 13 te focus');
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(8).yellow", function (res) {
                                    this.assert(res, true, "La caixa de subtítol 8 ha canviat d'estat a 'yellow'")
                                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action:eq(0)").text() == 'Yeah'), function (res) {
                                        this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action:eq(1)").text() == 'Yeeeeeah'), function (res) {
                                            this.assert(res, true, "El text de la caixa 8 els dos input han canviat");
                                            this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action").css("color") == "rgb(0, 147, 61)"), function (res) {
                                                this.assert(res, true, "El text de la caixa 8 sha posat en verd");
                                                done();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_acceptDoubleLineSubtitleWithEdition(done) {
            $(".subtitle-box-replaced-view:eq(8) .accept-subtitlebox-action").click()
            this.waitUntilEl(".subtitle-box-replaced-view:eq(8).accepted", function (res) {
                this.assert(res, true, "La caixa de subtítol 8 ha estat acceptada i ha canviat d'estat a 'accepted'")
                done();
            });
        },
        function Editor_unacceptDoubleLineSubtitleWithEdition(done) {
            $(".subtitle-box-replaced-view:eq(8) .accept-subtitlebox-action").click()
            this.waitUntilEl(".subtitle-box-replaced-view:eq(8):not(.accepted)", function (res) {
                this.assert(res, true, "La capsa de subtítol 8 ha estat desacceptada i ha canviat d'estat")
                done();
            });
        },

        function Editor_acceptSubtitleWithFocus(done) {
            doFocus($(".subtitle-box-replaced-view:eq(15)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(15).focus", function (res) {
                this.assert(res, true, "La capsa 15 te focus")
                $(".subtitle-box-replaced-view:eq(15) .accept-subtitlebox-action").click()
                this.waitUntilEl(".subtitle-box-replaced-view:eq(15).accepted", function (res) {
                    this.assert(res, true, "La capsa 15 s'ha acceptat")
                    done();
                });
            });
        },

        function Editor_unacceptSubtitleWithFocus(done) {
            doFocus($(".subtitle-box-replaced-view:eq(15)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(15).focus", function (res) {
                this.assert(res, true, "La capsa 15 te focus")
                $(".subtitle-box-replaced-view:eq(15) .accept-subtitlebox-action").click()
                this.waitUntilEl(".subtitle-box-replaced-view:eq(15):not(.accepted)", function (res) {
                    this.assert(res, true, "La capsa 15 s'ha desacceptat")
                    done();
                });
            });
        },


        function Editor_acceptSubtitleWithoutFocus(done) {
            doFocus($(".subtitle-box-replaced-view:eq(20)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(20).focus", function (res) {
                this.assert(res, true, "La capsa 20 te focus")
                doFocus($(".subtitle-box-replaced-view:eq(22)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(22).focus", function (res) {
                    this.assert(res, true, "La capsa 22 te focus")
                    $(".subtitle-box-replaced-view:eq(20) .accept-subtitlebox-action").click()
                    this.waitUntilEl(".subtitle-box-replaced-view:eq(20).accepted", function (res) {
                        this.assert(res, true, "La capsa 20 s'ha acceptat")
                        done();
                    });
                });
            });
        },

        function Editor_unacceptSubtitleWithoutFocus(done) {
            doFocus($(".subtitle-box-replaced-view:eq(22)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(22).focus", function (res) {
                this.assert(res, true, "La capsa 22 te focus")
                $(".subtitle-box-replaced-view:eq(20) .accept-subtitlebox-action").click()
                this.waitUntilEl(".subtitle-box-replaced-view:eq(20):not(.accepted)", function (res) {
                    this.assert(res, true, "La capsa 20 s'ha desacceptat")
                    done();
                });
            });
        },

        function Editor_undoModifiedSubtitle(done) {
            //S'ha de agafar una capsa que no hagi sigut tocada
            //S'ha de guardar el valor de la capsa (text automàtic)
            //S'ha de fer previament un canvi a una capsa
            //S'ha de provocar un change per poder veure el canvi de la capsa
            //Mirar que una capsa tingui el boto de Undo Subtitle activat
            //S'ha de fer click en el botó de Undo i comprovar que el text de la capsa equival al automàtic
            //Mirar que la capsa no te cap dels estats "accepted, yellow, conflict"
            var automaticText;

            doFocus($(".subtitle-box-replaced-view:eq(17)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(17).focus", function (res) {
                this.assert(res, true, 'La capsa 17 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(17)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(17).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    automaticText = $(".subtitle-box-replaced-view:eq(17) input").val();
                    $(".subtitle-box-replaced-view:eq(17) input").val("Yeah")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(17) input").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la capsa');
                        $(".subtitle-box-replaced-view:eq(17) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(17) input.proposed-modified-action").change()
                        doFocus($(".subtitle-box-replaced-view:eq(18)"));
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(18).focus", function (res) {
                            this.assert(res, true, 'La caps 18 te focus');
                            this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(17) .undo-proposed-action")[0] != ""), function (res) {
                                this.assert(res, true, "El boto de Undo Subtitle esta activat'")
                                $(".subtitle-box-replaced-view:eq(17) .undo-proposed-action").trigger('click')
                                $(".subtitle-box-replaced-view:eq(17) .undo-proposed-action").change()
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(17):not(.yellow):not(.accepted):not(.conflict)", function (res) {
                                    this.assert(res, true, "La capsa 17 ja no esta a yellow")
                                    this.waitUntilConditionAccomplished(() => (automaticText == $(".subtitle-box-replaced-view:eq(17) .on-click-box-action:eq(2) div:eq(0)").html()), function (res) {
                                        this.assert(res, true, "El input ha tornat al text automatic correctament")
                                        done();
                                    });
                                });

                            });
                        });
                    });
                });
            });
        },

        function Editor_undoModifiedAcceptedSubtitle(done) {
            //S'ha de agafar una capsa que no hagi sigut tocada
            //S'ha de guardar el valor de la capsa (text automàtic)
            //S'ha de fer previament un canvi a una capsa
            //S'ha de provocar un change per poder veure el canvi de la capsa
            //Acceptar la capsa
            //Mirar que una capsa tingui el boto de Undo Subtitle activat
            //S'ha de fer click en el botó de Undo i comprovar que el text de la capsa equival al automàtic
            //Mirar que la capsa no te cap dels estats "accepted, yellow, conflict"
            var automaticText;

            doFocus($(".subtitle-box-replaced-view:eq(27)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(27).focus", function (res) {
                this.assert(res, true, 'La capsa 27 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(27)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(27).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    automaticText = $(".subtitle-box-replaced-view:eq(27) input").val();
                    $(".subtitle-box-replaced-view:eq(27) input").val("Yeah")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(27) input").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la capsa');
                        $(".subtitle-box-replaced-view:eq(27) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(27) input.proposed-modified-action").change()
                        $(".subtitle-box-replaced-view:eq(27) .accept-subtitlebox-action").click()
                        doFocus($(".subtitle-box-replaced-view:eq(28)"));
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(28).focus", function (res) {
                            this.assert(res, true, 'La caps 28 te focus i la 27 ha sigut modificada i acceptada');
                            this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(27) .undo-proposed-action")[0] != ""), function (res) {
                                this.assert(res, true, "El boto de Undo Subtitle esta activat'")
                                $(".subtitle-box-replaced-view:eq(27) .undo-proposed-action")[0].click()
                                $(".subtitle-box-replaced-view:eq(27) .undo-proposed-action").trigger('click')
                                $(".subtitle-box-replaced-view:eq(27) .undo-proposed-action").change()
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(27):not(.yellow):not(.accepted):not(.conflict)", function (res) {
                                    this.assert(res, true, "La capsa 27 ja no esta a yellow")
                                    this.waitUntilConditionAccomplished(() => (automaticText == $(".subtitle-box-replaced-view:eq(27) .on-click-box-action:eq(2) div:eq(0)").html()), function (res) {
                                        this.assert(res, true, "El input ha tornat al text automatic correctament")
                                        done();
                                    });
                                });

                            });
                        });
                    });
                });
            });
        },

        function Editor_undoModifiedDoubleLineSubtitle(done) {
            //S'ha de agafar una capsa que no hagi sigut tocada
            //S'ha de guardar el valor de la capsa (text automàtic)
            //S'ha de fer previament un canvi a una capsa
            //S'ha de provocar un change per poder veure el canvi de la capsa
            //Mirar que una capsa tingui el boto de Undo Subtitle activat
            //S'ha de fer click en el botó de Undo i comprovar que el text de la capsa equival al automàtic
            //Mirar que la capsa no te cap dels estats "accepted, yellow, conflict"
            var automaticText;
            doFocus($(".subtitle-box-replaced-view:eq(29)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(29).focus", function (res) {
                this.assert(res, true, 'La capsa 29 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(29)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(29).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    automaticText = $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val();
                    console.log(automaticText);
                    $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val("Yeah");
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(29) input:eq(0)").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la capsa');
                        $(".subtitle-box-replaced-view:eq(29) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(29) input.proposed-modified-action").change()
                        $(".subtitle-box-replaced-view:eq(29) .accept-subtitlebox-action").click()
                        doFocus($(".subtitle-box-replaced-view:eq(30)"));
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(30).focus", function (res) {
                            this.assert(res, true, 'La caps 28 te focus i la 29 ha sigut modificada i acceptada');
                            this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(29) .undo-proposed-action")[0] != ""), function (res) {
                                this.assert(res, true, "El boto de Undo Subtitle esta activat'")
                                $(".subtitle-box-replaced-view:eq(29) .undo-proposed-action")[0].click()
                                $(".subtitle-box-replaced-view:eq(29) .undo-proposed-action").trigger('click')
                                $(".subtitle-box-replaced-view:eq(29) .undo-proposed-action").change()
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(29):not(.yellow):not(.accepted):not(.conflict)", function (res) {
                                    this.assert(res, true, "La capsa 29 ja no esta a yellow")
                                    console.log($(".subtitle-box-replaced-view:eq(29) .on-click-box-action:eq(2) div:eq(0)").html().trim());
                                    this.waitUntilConditionAccomplished(() => (automaticText == $(".subtitle-box-replaced-view:eq(29) .on-click-box-action:eq(2) div:eq(0)").html().trim()), function (res) {
                                        this.assert(res, true, "El input ha tornat al text automatic correctament")
                                        done();
                                    });
                                });

                            });
                        });
                    });
                });
            });
        },

        //Test per veure si un subtitol sense editar es correcte despres d'acceptar
        function Editor_cancelEditionBasic(done) {
            //S'ha d'emmagatzemar el text Automatic.
            //S'ha d'agafar una capsa i provocarli un canvi a proposed modified input
            //S'ha de fer un click al boto que conté la acció "cancel-action"
            //Mirar que es retorna al text Automatic
            var automaticText;
            doFocus($(".subtitle-box-replaced-view:eq(28)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(28).focus", function (res) {
                this.assert(res, true, 'La capsa 28 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(28)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(28).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    automaticText = $(".subtitle-box-replaced-view:eq(28) input").val()
                    $(".subtitle-box-replaced-view:eq(28) input").val("Yeah")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(28) input").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la capsa');
                        $(".subtitle-box-replaced-view:eq(28) .cancel-edition-action").click()
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(28).focus", function (res) {
                            this.assert(res, true, "El input segueix en focus")
                            this.waitUntilConditionAccomplished(() => (automaticText == $(".subtitle-box-replaced-view:eq(28) input").val()), function (res) {
                                this.assert(res, true, "El input ha tornat al text automatic correctament")
                                done();
                            });
                        });
                    });
                });
            });
        },

        function Editor_cancelEditionExtended(done) {
            //S'ha de cambiar el text d'una capsa
            //S'ha de clicar el checkBox per acceptar el subtitol i comprovar que es posa en verd
            //S'ha de guardar aquest valor en una nova variable per comprovar despres
            //S'ha de canviar el text i fer click al cancel-edition per comprovar que s'ha tornat al text amb la variable guardada
            /////////////REPETIR PROCES 2 COPS?////////////
            var automaticText;
            doFocus($(".subtitle-box-replaced-view:eq(29)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(29).focus", function (res) {
                this.assert(res, true, 'La capsa 29 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(29)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(29).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');

                    $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val("Yeah")


                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(29) input:eq(0)").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la capsa');
                        automaticText = $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val()
                        $(".subtitle-box-replaced-view:eq(29) .accept-subtitlebox-action").click()
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(29).accepted", function (res) {
                            this.assert(res, true, 'La capsa 29 sha acceptat');

                            this.waitUntilEl(".subtitle-box-replaced-view:eq(30).focus", function (res) {
                                this.assert(res, true, 'La capsa 30 te focus');

                                doFocus($(".subtitle-box-replaced-view:eq(29)"))
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(29).focus", function (res) {
                                    this.assert(res, true, 'La capsa 29 torna a tenir focus');
                                    doFocus($(".subtitle-box-replaced-view:eq(29)"))

                                    this.waitUntilEl(".subtitle-box-replaced-view:eq(29).focus input.proposed-modified-action", function (res) {
                                        this.assert(res, true, 'Sha obert la capsa 29 de nou');

                                        $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val("aaa")

                                        this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(29) input:eq(0)").val() == 'aaa'), function (res) {
                                            this.assert(res, true, 'Sha modificat la capsa');

                                            $(".subtitle-box-replaced-view:eq(29) .cancel-edition-action").click()
                                            this.waitUntilEl(".subtitle-box-replaced-view:eq(29).focus", function (res) {
                                                this.assert(res, true, "El input segueix en focus")
                                                this.waitUntilConditionAccomplished(() => (automaticText == $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val()), function (res) {
                                                    this.assert(res, true, "El input ha tornat al text automatic correctament")
                                                    done();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_emptySubtitle(done) {
            //S'ha de agafar una capsa i buidarli el text del input (Intentar que sigui una capsa d'una sola linea)
            //Mirar que despres de perdre el focus es manté buit el span
            //Mirar que passa a un estat de "yellow"
            doFocus($(".subtitle-box-replaced-view:eq(31)"))
            this.waitUntilEl('.subtitle-box-replaced-view:eq(31).focus', function (res) {
                this.assert(res, true, 'La capsa 31 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(31)"))
                this.waitUntilEl('.subtitle-box-replaced-view:eq(31).focus input.proposed-modified-action', function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(31) input").val('')
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(31) input").val() == ''), function (res) {
                        this.assert(res, true, 'El input esta buit');
                        $(".subtitle-box-replaced-view:eq(31) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(31) input.proposed-modified-action").change()

                        doFocus($(".subtitle-box-replaced-view:eq(32)"))
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(32).focus", function (res) {
                            this.assert(res, true, 'La capsa 32 esta en focus');
                            this.waitUntilEl(".subtitle-box-replaced-view:eq(31).yellow", function (res) {
                                this.assert(res, true, 'La capsa 31 esta en yellow');
                                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(31) .proposed-modified-action").html() == ""), function (res) {
                                    this.assert(res, true, 'La capsa 31 segueix buida');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        },


        function Editor_largeTextChecker(done) {
            //S'ha de agafar una capsa i posarli com a text al input un text molt llarg
            //Mirar que apareix el warning de text llarg
            //Mirar que si possem un subtitol curt "Hola", desapareix el warning
            doFocus($(".subtitle-box-replaced-view:eq(33)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(33).focus", function (res) {
                this.assert(res, true, 'La capsa 33 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(33)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(33).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(33) input").val("Esto es un texto muy muy muy muy muy muy muy muy muy muy muy muy largo")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(33) input").val() == 'Esto es un texto muy muy muy muy muy muy muy muy muy muy muy muy largo'), function (res) {
                        this.assert(res, true, 'El input ha canviat');
                        $(".subtitle-box-replaced-view:eq(33) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(33) input.proposed-modified-action").change()

                        doFocus($(".subtitle-box-replaced-view:eq(32)"))
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(32).focus", function (res) {
                            this.assert(res, true, 'La capsa 32 esta en focus');

                            this.waitUntilEl(".subtitle-box-replaced-view:eq(33).yellow", function (res) {
                                this.assert(res, true, 'La capsa 33 esta en yellow');

                                this.waitUntilEl(".subtitle-box-replaced-view:eq(33) .prevent-default-action", function (res) {
                                    this.assert(res, true, 'Apareix warning');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_largeTextCheckerHidden(done) {
            //S'ha de agafar la capsa del text anterior
            //S'ha de posar un text curt "Hola"
            //Mirar que desapareix el canvi un cop fet el change i el input
            doFocus($(".subtitle-box-replaced-view:eq(33)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(33).focus", function (res) {
                this.assert(res, true, 'La capsa 33 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(33)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(33).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(33) input").val("hola")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(33) input").val() == 'hola'), function (res) {
                        this.assert(res, true, 'El input ha canviat');
                        $(".subtitle-box-replaced-view:eq(33) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(33) input.proposed-modified-action").change()

                        doFocus($(".subtitle-box-replaced-view:eq(32)"))
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(32).focus", function (res) {
                            this.assert(res, true, 'La capsa 32 esta en focus');

                            this.waitUntilEl(".subtitle-box-replaced-view:eq(33).yellow", function (res) {
                                this.assert(res, true, 'La capsa 33 esta en yellow');

                                this.waitUntilConditionAccomplished(() => ($('.subtitle-box-replaced-view:eq(33) td:eq(3) a:eq(1)').attr('class') == 'undo-proposed-action'), function (res) {
                                    this.assert(res, true, 'Desapareix warning');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_testFilterOpen(done) {
            //     //S'ha de clicar el dropdown toggle
            //     //Mirar que el dropdown s'ha obert

            //     $('.dropdown-toggle').click()
            //     $(".dropdown-toggle").change()
            //     this.waitUntilEl(".R-dropdown.open.show", function(res){   
            //         this.assert(res, true, "El filtre s'ha desplegat")
            //         done();
            //     });
            done();
        },

        function Editor_filterAcceptedSubtitles(done) {
            doFocus($(".subtitle-box-replaced-view:eq(100)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(100).focus", function (res) {
                this.assert(res, true, "La capsa 100 te focus")
                doFocus($(".subtitle-box-replaced-view:eq(103)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(103).focus", function (res) {
                    this.assert(res, true, "La capsa 103 te focus")
                    $(".subtitle-box-replaced-view:eq(103) .accept-subtitlebox-action").click()
                    this.waitUntilEl(".subtitle-box-replaced-view:eq(103).accepted", function (res) {
                        this.assert(res, true, "La capsa 103 s'ha acceptat")
                        $(".subtitle-box-replaced-view:eq(100) .accept-subtitlebox-action").click()
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(100).accepted", function (res) {
                            this.assert(res, true, "La capsa 100 s'ha acceptat")
                            $('.dropdown-item')[1].click()
                            this.waitUntilEl(".dropdown-toggle:contains(Accepted)", function (res) {
                                this.assert(res, true, "El filtre ha cambiat a accepted")
                                $("a.refresh-filter-action").click()
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(101)[hidden]", function (res) {
                                    this.assert(res, true, "La capsa 101 esta amagada")
                                    this.waitUntilConditionAccomplished(() => ($('.subtitle-box-replaced-view:not([hidden])').length == 3), function (res) {
                                        this.assert(res, true, "Apareixen 3 capses acceptades")
                                        this.waitUntilConditionAccomplished(() => ($('.accepted.subtitle-box-replaced-view').length == $('.subtitle-box-replaced-view:not([hidden])').length), function (res) {
                                            this.assert(res, true, "Les 3 capses estan de color verd")
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_testFocusHidden(done) {
            //S'ha de fer focus a la capsa 101
            //S'ha de treure l'acceptar de la capsa 101
            //Mirar que el focus esta a la 103
            doFocus($(".subtitle-box-replaced-view:eq(101)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(101).focus", function (res) {
                this.assert(res, true, "La capsa 101 te focus")
                $('.subtitle-box-replaced-view:eq(101) .accept-subtitlebox-action').click()
                this.waitUntilEl(".subtitle-box-replaced-view:eq(103).focus", function (res) {
                    this.assert(res, true, "El focus ha saltat correctament a la capsa 103")
                    done()
                });
            });
        },

        function Editor_filterEditedSubtitles(done) {
            //Mateix proceés que en accepted
            $('.dropdown-item')[2].click()
            $("a.refresh-filter-action").click()
            this.waitUntilEl(".dropdown-toggle:contains(Edited)", function (res) {
                this.assert(res, true, "El filtre ha cambiat a Edited")
                this.waitUntilConditionAccomplished(() => ($('.subtitle-box-replaced-view.view-attached:not([hidden])').length == 6), function (res) {
                    this.assert(res, true, "Hi ha 6 caixes visibles")
                        done();
                });
            });
        },

        function Editor_filterPendingSubtitles(done) {
            //Mateix proceés que en accepted
            $('.dropdown-item')[3].click()
            $("a.refresh-filter-action").click()
            this.waitUntilEl(".dropdown-toggle:contains(Pending)", function (res) {
                this.assert(res, true, "El filtre ha cambiat a Pending")
                this.waitUntilEl(".subtitle-box-replaced-view:not([hidden]):eq(0):not(.yellow):not(.accepted):not(.conflict)", function (res) {
                    this.assert(res, true, "La primera caixa no te yellow, accepted ni conflict")
                    done();
                });
            });
        },


        function Editor_filterConflictSubtitles(done) {
            $('.dropdown-item')[4].click()
            $("a.refresh-filter-action").click()
            this.waitUntilEl(".dropdown-toggle:contains(Conflict)", function (res) {
                this.assert(res, true, "El filtre ha cambiat a Conflict")
                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:not([hidden])").length == 0), function (res) {
                    this.assert(res, true, "No hi ha cap capsa")
                    done();
                });
            });
        },

        function Editor_filterEmptySubtitles(done) {
            //Mateix procés que en accepted
            $('.dropdown-item')[5].click()
            $("a.refresh-filter-action").click()
            this.waitUntilEl(".dropdown-toggle:contains(Empty subtitles)", function (res) {
                this.assert(res, true, "El filtre ha cambiat a Empty subtitles")
                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:not([hidden])").length == 1), function (res) {
                    this.assert(res, true, "Hi ha una capsa")
                    $('.dropdown-item')[0].click()
                    $("a.refresh-filter-action").click()
                    done();
                });
            });
        },


        function Editor_checkHelpModal(done) {
            //S'ha de clicar al boto de help
            //Mirar que apareix la modal de Help
            //Mirar que conte informació
            //Mirar que clicant fora no desapareix la modal
            //Mirar que es pot tancar la modal fent click a la creueta o close
            //Mirar que desapareix la Modal

            $(".get-help-action").click()
            //$(".get-help-action").change()

            this.waitUntilEl('.modal.fade.modal-template-view.view-attached.show.in', function (res) {
                this.assert(res, true, 'Apareix la modal help');
                this.waitUntilConditionAccomplished(() => ($(".modal-body table td")[7].firstChild.nodeValue == "Accept subtitle"), function (res) {
                    this.waitUntilConditionAccomplished(() => ($(".modal-body table td")[23].firstChild.nodeValue == "Edited but not accepted"), function (res) {
                        this.assert(res, true, 'Help conté informació');

                        $(".close-action")[0].click()
                        this.waitUntilEl(".modal.fade.modal-template-view.view-attached:not(.show.in)", function (res) {
                            this.assert(res, true, 'El modal es tanca be');
                            done();
                        });
                    });
                });

            });
        },

        function Editor_checkFinishDisable(done) {
            //S'ha de provar de clicar el boto de Finish
            //Mirar que no es mostra cap modal
            $(".finish-task-action").click()
            this.waitUntilEl('.modal.fade.modal-template-view.view-attached:not(.show.in)', function (res) {
                this.assert(res, true, "No apareix cap modal")
                done();
            });
        },


        function Editor_checkTitleAndDescription(done) {
            //Mirar que te la clase redtitle
            //S'ha de clicar el "boto" title and description
            //Mirar que es mostra la modal de title and description i que te contingut
            //S'ha de clicar el boto close
            //Mirar que es tanca la modal
            //Mirar que continua tenint la clase redtitle
            //Tornar a clicar el boto per obrir la modal
            this.waitUntilEl('.edit-action.R-edit-title-description.redtitle', function (res) {
                this.assert(res, true, "Titol i descripcio tenen la classe redtitle")
                $(".edit-action.R-edit-title-description.redtitle")[0].click()

                this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached.show.in', function (res) {
                    this.assert(res, true, "Es mostra la modal de title i description")
                    $(".close-action").trigger('click')
                    this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                        this.assert(res, true, "La modal es tanca correctament")
                        done();
                    });
                });
            });
        },

        function Editor_checkTitleEdition(done) {
            //Mirar que hi ha contingut en el Translated title
            //S'ha de clicar sobre el translated title
            //Mirar que apareix un input
            //S'ha de cambiar el text del titol per qualsevol cosa i provocar un event de change//input
            //Mirar que desapareix el input i es substitueix per un span que conte el text canviat
            //Mirar que aquest titol te la classe edited (es de color verd)
            //Mirar que aquest titol te la classe yellow

            $(".edit-action.R-edit-title-description.redtitle")[0].click()

            this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached.show.in', function (res) {
                this.assert(res, true, "Es mostra la modal de title i description")
                $('.change-title-action').click()

                this.waitUntilEl('input.title-modified-action', function (res) {
                    $("input.title-modified-action").val("hola")

                    this.waitUntilConditionAccomplished(() => ($("input.title-modified-action").val() == 'hola'), function (res) {
                        this.assert(res, true, 'El input ha canviat');

                        $("input.title-modified-action").trigger('input')
                        $("input.title-modified-action").change()

                        this.waitUntilEl('span.T-title.corrected', function (res) {
                            this.assert(res, true, 'El span ha canviat');

                            this.waitUntilConditionAccomplished(() => ($('span.T-title.corrected').html() == 'hola'), function (res) {
                                this.assert(res, true, 'El span ha canviat correctament');

                                this.waitUntilEl('.yellow.R-right.display-flex.justify-content', function (res) {
                                    this.assert(res, true, 'La capsa esta en yellow');
                                    $(".close-action.btn.btn-primary")[0].click()
                                    this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                                        this.assert(res, true, "La modal es tanca correctament")
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_checkTitleAndDescriptionButton2(done) {
            //Mirar que el Boto de edit title and description (DE LA PAGINA PRINCIPAL) te la clase ENCARA de redtitle
            this.waitUntilEl('.edit-action.R-edit-title-description.redtitle', function (res) {
                this.assert(res, true, "Titol i descripcio encara tenen la classe redtitle")
                done();
            });
        },

        function Editor_checkSynopsisEdition(done) {
            //Mirar que hi ha contingut en el Translated synopsis
            //S'ha de clicar sobre el translated synopsis
            //Mirar que apareix un textarea
            //S'ha de cambiar el text del titol per qualsevol cosa i provocar un event de change//input
            //Mirar que desapareix el textarea i es substitueix per un span que conte el text canviat
            //Mirar que aquest titol te la classe edited (es de color verd)
            //Mirar que aquest titol te la classe yellow
            $(".edit-action.R-edit-title-description.redtitle")[0].click()
            this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached.show.in', function (res) {
                this.assert(res, true, "Es mostra la modal de title i description")
                $('.change-synopsis-action').click()
                this.waitUntilEl('textarea.synopsis-modified-action', function (res) {
                    $("textarea.synopsis-modified-action").val("hola")
                    this.waitUntilConditionAccomplished(() => ($("textarea.synopsis-modified-action").val() == 'hola'), function (res) {
                        this.assert(res, true, 'El input ha canviat');
                        $("textarea.synopsis-modified-action").trigger('input')
                        $("textarea.synopsis-modified-action").change()
                        this.waitUntilEl('div.T-description.corrected', function (res) {
                            this.assert(res, true, 'El div ha canviat');
                            this.waitUntilConditionAccomplished(() => ($('div.T-description.corrected').html() == 'hola'), function (res) {
                                this.assert(res, true, 'El div ha canviat correctament');
                                this.waitUntilEl('.R-description .R-wrapper .R-right.yellow', function (res) {
                                    this.assert(res, true, 'La capsa esta en yellow');
                                    $(".close-action.btn.btn-primary")[0].click()
                                    this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                                        this.assert(res, true, "La modal es tanca correctament")
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Editor_AcceptTitleAndDescription(done) {
            //Sha de clicar el checkbox de title
            //Mirar que el títol conte la clase accepted
            //Sha de clicar el checkbox de description
            //Mirar que la descripció conte la clase accepted
            //Mirar que el boto edit title and description de la pagina principal ja no te la clase redtitle

            $(".edit-action.R-edit-title-description.redtitle")[0].click()
            this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached.show.in', function (res) {
                this.assert(res, true, "Es mostra la modal de title i description")
                $('.accept-title-action').click()
                this.waitUntilEl('.R-title .R-wrapper .accepted.R-right', function (res) {
                    this.assert(res, true, 'El títol saccepta i apareix de color verd');
                    $('.accept-synopsis-action').click()
                    this.waitUntilEl('.R-description .R-wrapper .accepted.R-right', function (res) {
                        this.assert(res, true, 'La sinopsis saccepta i apareix de color verd');
                        $(".close-action.btn.btn-primary")[0].click()
                        this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                            this.assert(res, true, "La modal es tanca correctament")
                            this.waitUntilEl('.edit-action.R-edit-title-description:not(.redtitle)', function (res) {
                                this.assert(res, true, "Titol i descripcio no tenen la classe redtitle")
                                done();
                            });
                        });
                    });
                });
            });
        },


        function Editor_checkTitleUndo(done) {
            //Sha de clicar el undo de title
            //Mirar que el titol ha tornat a un estat base sense accepted, yellow/ conflict
            //Mirar que el títol ha tornat al estat automatic
            $(".edit-action.R-edit-title-description")[0].click()
            this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached.show.in', function (res) {
                this.assert(res, true, "Es mostra la modal de title i description")
                $('.undo-title-action').click()
                this.waitUntilEl('.R-title .R-wrapper .R-right:not(.accepted)', function (res) {
                    this.assert(res, true, 'El títol no te estat accepted');
                    this.waitUntilConditionAccomplished(() => ($('.T-title:eq(1)').html() != 'hola'), function (res) {
                        this.assert(res, true, 'El títol torna al automatic');
                        done();
                    });
                });
            });
        },

        function Editor_checkSynopsisUndo(done) {
            //Sha de clicar el undo de description
            //Mirar que la descripció ha tornat a un estat base sense accepted, yellow/ conflict
            //Mirar que la descripció ha tornat al estat automatic
            $('.undo-synopsis-action').click()
            this.waitUntilEl('.R-description .R-wrapper .R-right:not(.accepted)', function (res) {
                this.assert(res, true, 'La sinopsis no te estat accepted');
                this.waitUntilConditionAccomplished(() => ($('.T-description:eq(1)').html() != 'hola'), function (res) {
                    this.assert(res, true, 'La sinopsis torna al automatic');
                    done();
                });
            });
        },

        function Editor_checkCloseTitleAndDescriptionByX(done) {
            //S'ha de clicar el Botó X de la cantonada superior dreta
            //Mirar que la modal es tanca
            //Mirar que el boto edit title and description ja te la clase redtitle
            $('.close-action').click()
            this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                this.assert(res, true, "La modal es tanca correctament")
                this.waitUntilEl('.edit-action.R-edit-title-description.redtitle', function (res) {
                    this.assert(res, true, "Titol i descripcio tenen la classe redtitle")
                    done();
                });
            });
        },

        function Editor_checkStatsNo0(done) {
            //Mirar que la estadistica de viewed no es 0
            //Mirar que la estadistica de accepted no es 0
            //Mirar que la estadistica de edited no es 0
            this.waitUntilConditionAccomplished(() => ($('#viewedNum').html() != 0), function (res) {
                this.assert(res, true, "La estadistica de viewed no es 0")
                this.waitUntilConditionAccomplished(() => ($('#acceptedNum').html() != 0), function (res) {
                    this.assert(res, true, "La estadistica de accepted no es 0")
                    this.waitUntilConditionAccomplished(() => ($('#editedNum').html() != 0), function (res) {
                        this.assert(res, true, "La estadistica de edited no es 0")
                        done();
                    });
                });
            });
        },

        function Editor_checkPauseVideoWhileTypingButton(done) {
            //Fer click al video per fer play
            //Mirar que el video esta en play mode
            //Realitzar un event de input per simular el premer una tecla
            //Mirar que el video ja no esta en play mode
            //Desactivar el pauseOnVideoWhileTyping
            //Fer click al video per fer play
            //Mirar que el video esta en play mode
            //Realitzar un event de input per simular el premer una tecla
            //Mirar que el video continui en estat play mode
            var e = jQuery.Event("keydown", {
                keyCode: 64
            });

            $('#my-video_html5_api').trigger('play')

            this.waitUntilEl('.R-video.video-js.vjs-default-skin.vjs-controls-enabled.vjs-workinghover.vjs-v7.my-video-dimensions.vjs-has-started.vjs-user-inactive.vjs-playing', function (res) {
                this.assert(res, true, "El video està en play")
                jQuery("body").trigger(e);
                this.waitUntilEl('.R-video.video-js.vjs-default-skin.vjs-controls-enabled.vjs-workinghover.vjs-v7.my-video-dimensions.vjs-has-started.vjs-user-inactive.vjs-paused', function (res) {
                    this.assert(res, true, "El video està en pause")
                    $(".typing-behaviour-action").click();
                    $('.typing-behaviour-action').change();
                    $('#my-video_html5_api').trigger('play')
                    this.waitUntilEl('.R-video.video-js.vjs-default-skin.vjs-controls-enabled.vjs-workinghover.vjs-v7.my-video-dimensions.vjs-has-started.vjs-user-inactive.vjs-playing', function (res) {
                        this.assert(res, true, "El video està en play")
                        setTimeout(function () {
                            jQuery("body").trigger(e)
                        }, 3000);
                        this.waitUntilEl('.R-video.video-js.vjs-default-skin.vjs-controls-enabled.vjs-workinghover.vjs-v7.my-video-dimensions.vjs-has-started.vjs-user-inactive.vjs-playing', function (res) {
                            this.assert(res, true, "El video no es para")
                            $('#my-video_html5_api').trigger('pause')
                            done();
                        });
                    });
                });
            });
        },


        function Editor_checkButtonSaveModal(done) {
            //Fer click al boto save Modal
            //Mirar que s'obre la modal de Save (comprovar el titol)
            $(".save-progress-action").click()
            $(".save-progress-action").change()
            this.waitUntilEl('.modal.fade.modal-template-view.view-attached.show.in', function (res) {
                this.assert(res, true, "Apareix la modal de save")
                $('.close-action').click()
                this.waitUntilEl('.modal.fade.modal-template-view.view-attached:not(.show.in)', function (res) {
                    this.assert(res, true, "Es tanca la modal")
                    done();
                });
            });
        },

        function Editor_checkAddSubtitleLine(done) {

            doFocus($(".subtitle-box-replaced-view:eq(156)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(156).focus", function (res) {
                this.assert(res, true, 'La capsa 156 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(156)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(156).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".add-line-action").click();
                    this.waitUntilConditionAccomplished(() => ($('input.proposed-modified-action').length == 2), function (res) {
                        this.assert(res, true, 'Segona linia de subtítol habilitada');
                        done()
                    });
                });

            });

        },

        function Editor_checkRemoveSubtitleLine(done){

            doFocus($(".subtitle-box-replaced-view:eq(155)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(155).focus", function (res) {
                this.assert(res, true, 'La capsa 155 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(155)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(155).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".remove-line-action").click();
                    this.waitUntilConditionAccomplished(() => ($('input.proposed-modified-action').length == 1), function (res) {
                        this.assert(res, true, "S'ha esborrat la segona línia de subtítol");
                        done()
                    });
                });
            });

        },


        // function Editor_acceptAllBoxes(done, timeout) {
        //     //Acceptar totes les capses
        //     //Acceptar titol i sinopsis
        //     //Mirar si el boto de finish ja no te l'atribut disabled
        //     clearTimeout(timeout);
        //     doFocusRecursively.call(this, 0, function () {
        //         done();
        //     });

        // },
    ]
})