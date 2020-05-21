define([], function () {
    var ebuttd = "tot el ebuttd"
    var AcceptedBoxes = "tr.subtitle-box-replaced-view.accepted";
    var ConflictBoxes = "tr.subtitle-box-replaced-view.reject";
    var YellowBoxes = "tr.subtitle-box-replaced-view.yellow";

    clickAcceptCheckBox = function (BoxToAccept) {
        BoxToAccept.find('.accept-action').click()
    }

    doFocus = function (Element) {
        Element[0].children[0].click()
    }


    return [
        function Revwr_setTaskOnEdition(done) {
            //Fer una crida ajax a la API per posar la tasca a "OnEdition"
            //Fer algun tipus d'espera per donar temps a la crida

            done();
        },

        function Revwr_FinishEditorTaskWithEbuttd(done) {
            window.location.href = "#reviewer?userid=32435&token=fdskk2315dasbgfn&job=0012"
            //fer una crida PUT amb el EBUTTD equivalent a finalitzat (Tot acceptat i algunes coses acceptades)
            //Esperar a ques s'executi la crida
            //Realitzar una acció de Finish
            //AjaxCall
        },


        function Revwr_checkHeader(done) {
            window.location.href = "#reviewer?userid=32435&token=fdskk2315dasbgfn&job=0012"
            this.waitUntilEl("h1:contains(Subtitles Reviewer)", function (res) {
                this.assert(res, true, 'LA pàgina té h1 i es correctament com a Reviewer');
                done();
            });
        },

        function Revwr_checkInitialSubtitles(done) {
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
                            //Mirar que hi ha subtitols editats!
                            done();
                        });
                    });
                });
            });
        },

        function Revwr_checkInitialVideo(done) {
            //Mirar que hi ha un element de video          
            this.waitUntilEl($("video [src!='']"), function (res) {
                this.assert(res, true, "Hi ha un element video amb un link carregat");
                done();
            });
            //Mirar que no apareix la creueta conforme no s'ha pogut carregar el video per error "X"   
        },

        //Podriem fer 1000 checks de que la pagina esta carregada correctament        
        /////////Provarem que la modal de help es desplega i es pot tancar (i te continugt correcte)
        /////////Provarem que hi han simple subtitle box carregat
        /////////Provarem que hi han barres carregades




        



        function Revwr_testBoxFocusSingleLine(done) {
            doFocus($(".subtitle-box-replaced-view:eq(2)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(2).focus", function (res) {
                this.assert(res, true, 'La capsa 2 te focus');
                done();
            });
        },

        function Revwr_testBoxFocusDoubleLine(done) {
            doFocus($(".subtitle-box-replaced-view:eq(1)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(1).focus", function (res) {
                this.assert(res, true, 'La capsa 1 te focus');
                done();
            });
        },

        //Focus from collection de una capsa amb double line
        function Revwr_testBoxFocusFromCollection(done) {
            doFocus($(".subtitle-box-replaced-view:eq(4)"));
            this.waitUntilEl(".subtitle-box-replaced-view:eq(4).focus", function (res) {
                this.assert(res, true, "La capsa 4 te focus")
                this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(4).focus", function (res) {
                    this.assert(res, true, 'Les capses de la col·lecció i el video concorden')
                    done();
                    this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(4).focus", function (res) {
                        this.assert(res, true, 'Les capses de la col·lecció i el video concorden')

                    });
                })

            })
            //Mirar que el begintime d'aquesta capsa concorda amb el temps on esta el video colocat
            //Mirar que e begintime de la capsa que esta focused en el timeline concorda amb el de simplesubtitle fet focus
            //Mirar que el subtitol renderitzat concorda amb el text dintre de la capsa

        },

        //Testejar per una capsa que tingui 2 linies
        function Revwr_testSimpleBoxFocusFromCollection(done) {
            //S'ha d'agafar una capsa random unaltered de la coleccio de capses petites
            //S'ha de fer click a aquesta capsa
            doFocus($(".simple-subtitle-box-replaced-view:eq(4)"));


            //Mirar que aquesta capsa conte focus
            this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(4).focus", function (res) {
                this.assert(res, true, 'La capsa 4 te focus')
                //$(".simple-subtitle-box-replaced-view:eq(80) .R-up.on-click-box-action .R-tcin.on-click-box-action")[0].firstChild.nodeValue
                done();
            });

            //Mirar que el begintime d'aquesta capsa concorda amb el temps on esta el video colocat
            //Mirar que e begintime de la capsa que esta focused en el timeline concorda amb el del subtitel fet focus
            //Mirar que el subtitol renderitzat concorda amb el text dintre de la capsa
        },

        function Revwr_testVideoFocus(done) {
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

        function Revwr_testVideoRunningFocus(done) {
            //S'ha d'agafar un temps aleatori amb <1min abans del final minim
            //S'ha de fer play al video
            //Mirar que el video esta corrent
            //Mirar que passat un temps s'han recorregut X subtitols
            $('#my-video_html5_api')["0"].currentTime = 400;
            this.waitUntilConditionAccomplished(() => ($('.simple-subtitle-box-replaced-view.focus .on-click-box-action:eq(0) div:eq(0)').html() == "0:6:40:000"), function (res) {
                this.assert(res, true, "El video es sateja be")
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

        function Revwr_changeSubtitleText(done) {
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
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(10).accepted", function (res) {
                            this.assert(res, true, "La caixa del subtítol ha estat acceptada")
                            done();
                        });
                    });
                });
            });
        },

        function Revwr_doubleLineFirstSubtitleChange(done) {
            doFocus($(".subtitle-box-replaced-view:eq(1)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(1).focus", function (res) {
                this.assert(res, true, 'La capsa 1 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(1)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(1).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(1) input:eq(0)").val("Yeah")
                    var textSecondInput = $(".subtitle-box-replaced-view:eq(1) input:eq(1)").val();
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(1) input:eq(0)").val() == 'Yeah'), function (res) {
                        this.assert(res, true, 'Sha modificat la primera capsa');
                        $(".subtitle-box-replaced-view:eq(1) input.proposed-modified-action").trigger('input')
                        $(".subtitle-box-replaced-view:eq(1) input.proposed-modified-action").change()
                        doFocus($(".subtitle-box-replaced-view:eq(5)"));
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(5).focus", function (res) {
                            this.assert(res, true, 'La capsa 5 te focus');
                            this.waitUntilEl(".subtitle-box-replaced-view:eq(1).accepted", function (res) {
                                this.assert(res, true, "La caixa de subtítol 1 ha canviat d'estat a 'accepted'")
                                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(1) .proposed-modified-action:eq(0)").text() == 'Yeah'), function (res) {
                                    this.assert(res, true, "El text de la caixa 1 primer input ha canviat");
                                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(1) .proposed-modified-action").css("color") == "rgb(0, 147, 61)"), function (res) {
                                        this.assert(res, true, "El text de la caixa 1 sha posat en verd");
                                        this.waitUntilConditionAccomplished(() => (textSecondInput == $(".subtitle-box-replaced-view:eq(1) .proposed-modified-action:eq(1)").text()), function (res) {
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

        function Revwr_doubleLineSecondSubtitleChange(done) {
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
                        done();
                    });
                });
            });
        },

        function Revwr_doubleLineBothSubtitleChange(done) {
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
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(8).accepted", function (res) {
                                    this.assert(res, true, "La caixa de subtítol 8 ha canviat d'estat a 'accepted'")
                                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action:eq(0)").text() == 'Yeah'), function (res) {
                                        this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action:eq(1)").text() == 'Yeeeeeah'), function (res) {
                                            this.assert(res, true, "El text de la caixa 8 els dos input han canviat");
                                            this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(8) .proposed-modified-action").css("color") == "rgb(0, 147, 61)"),
                                                function (res) {
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


        //Test per veure si un subtitol sense editar es correcte despres d'acceptar
        function Revwr_undoModifiedAcceptedSubtitle(done) {
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
                                $(".subtitle-box-replaced-view:eq(27) .undo-proposed-action").trigger('click')
                                $(".subtitle-box-replaced-view:eq(27) .undo-proposed-action").change()
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(27).accepted", function (res) {
                                    this.assert(res, true, "La capsa 27 esta accepted")
                                    this.waitUntilConditionAccomplished(() => (automaticText == $(".subtitle-box-replaced-view:eq(27) .on-click-box-action:eq(2) div:eq(0)").html().trim()), function (res) {
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

        function Revwr_undoModifiedSubtitle(done) {
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
                                this.waitUntilEl(".subtitle-box-replaced-view.accepted", function (res) {
                                    this.assert(res, true, "La capsa 17 esta en accepted")
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

        function Revwr_undoModifiedDoubleLineSubtitle(done) {
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
                    automaticText = $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val()
                    $(".subtitle-box-replaced-view:eq(29) input:eq(0)").val("Yeah")
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
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(29).accepted", function (res) {
                                    this.assert(res, true, "La capsa 29 ja esta en accepted")
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
        function Revwr_cancelEditionBasic(done) {
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



        function Revwr_emptySubtitle(done) {
            //S'ha de agafar una capsa i buidarli el text del input (Intentar que sigui una capsa d'una sola linea)
            //Mirar que despres de perdre el focus es manté buit el span
            //Mirar que el subtitol esta en estat accepted
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
                            this.waitUntilEl(".subtitle-box-replaced-view:eq(31).accepted", function (res) {
                                this.assert(res, true, 'La capsa 31 esta en accepted');
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


        function Revwr_largeTextChecker(done) {
            //S'ha de agafar una capsa i posarli com a text al input un text molt llarg
            //Mirar que apareix el warning de text llarg
            //Mirar que si possem un subtitol curt "Hola", desapareix el warning
            doFocus($(".subtitle-box-replaced-view:eq(33)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(33).focus", function (res) {
                this.assert(res, true, 'La capsa 33 te focus');
                doFocus($(".subtitle-box-replaced-view:eq(33)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(33).focus input.proposed-modified-action", function (res) {
                    this.assert(res, true, 'Sha obert la capsa');
                    $(".subtitle-box-replaced-view:eq(33) input").val("Esto es un texto muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy largo")
                    this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(33) input").val() == 'Esto es un texto muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy muy largo'),
                        function (res) {
                            this.assert(res, true, 'El input ha canviat');
                            $(".subtitle-box-replaced-view:eq(33) input.proposed-modified-action").trigger('input')
                            $(".subtitle-box-replaced-view:eq(33) input.proposed-modified-action").change()

                            doFocus($(".subtitle-box-replaced-view:eq(32)"))
                            this.waitUntilEl(".subtitle-box-replaced-view:eq(32).focus", function (res) {
                                this.assert(res, true, 'La capsa 32 esta en focus');

                                this.waitUntilEl(".subtitle-box-replaced-view:eq(33).accepted", function (res) {
                                    this.assert(res, true, 'La capsa 33 esta en accepted');

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

        function Revwr_largeTextCheckerHidden(done) {
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

                            this.waitUntilEl(".subtitle-box-replaced-view:eq(33).accepted", function (res) {
                                this.assert(res, true, 'La capsa 33 esta en accepted');

                                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:eq(33) .prevent-default-action").html() == null), function (res) {
                                    this.assert(res, true, 'Desapareix warning');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        },

        function Revwr_testFilterOpen(done) {
            //S'ha de clicar el dropdown toggle
            //Mirar que el dropdown s'ha obert
            done();
        },

        //Realitzar aquest test en funció de la quantitat de resultats que provenen dels altres tests
        function Revwr_filterAcceptedSubtitles(done) {
            doFocus($(".subtitle-box-replaced-view:eq(100)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(100).focus", function (res) {
                this.assert(res, true, "La capsa 100 te focus")
                doFocus($(".subtitle-box-replaced-view:eq(104)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(104).focus", function (res) {
                    this.assert(res, true, "La capsa 104 te focus")
                    $(".subtitle-box-replaced-view:eq(104) .accept-subtitlebox-action").click()
                    this.waitUntilEl(".subtitle-box-replaced-view:eq(104).accepted", function (res) {
                        this.assert(res, true, "La capsa 104 s'ha acceptat")
                        $(".subtitle-box-replaced-view:eq(100) .accept-subtitlebox-action").click()
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(100).accepted", function (res) {
                            this.assert(res, true, "La capsa 100 s'ha acceptat")
                            $('.dropdown-item')[1].click()
                            this.waitUntilEl(".dropdown-toggle:contains(Accepted)", function (res) {
                                this.assert(res, true, "El filtre ha cambiat a accepted")
                                $("a.refresh-filter-action").click()
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(101)[hidden]", function (res) {
                                    this.assert(res, true, "La capsa 101 esta amagada")
                                    this.waitUntilConditionAccomplished(() => ($('.accepted.subtitle-box-replaced-view').length == $('.subtitle-box-replaced-view:not([hidden])').length), function (res) {
                                        this.assert(res, true, "Les capses acceptades son les que es mostren")
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        function Revwr_filterEditedSubtitles(done) {
            //Mateix proceés que en accepted
            $('.dropdown-item')[2].click()
            $("a.refresh-filter-action").click()
            this.waitUntilEl(".dropdown-toggle:contains(Edited)", function (res) {
                this.assert(res, true, "El filtre ha cambiat a Edited")
                this.waitUntilConditionAccomplished(() => ($('.subtitle-box-replaced-view.view-attached:not([hidden])').length == 5), function (res) {
                    this.assert(res, true, "Hi ha 5 caixes visibles")
                    done();
                });
            });
        },

        function Revwr_filterPendingSubtitles(done) {
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


        function Revwr_filterConflictSubtitles(done) {
            //Mateix procés que en accepted
            $('.dropdown-item')[5].click()
            $("a.refresh-filter-action").click()
            this.waitUntilEl(".dropdown-toggle:contains(Conflict)", function (res) {
                this.assert(res, true, "El filtre ha cambiat a Conflict")
                this.waitUntilConditionAccomplished(() => ($(".subtitle-box-replaced-view:not([hidden])").length == 0), function (res) {
                    this.assert(res, true, "No hi ha cap capsa")
                    done();
                });
            });
        },

        function Revwr_filterEmptySubtitles(done) {
            //Mateix proceés que en accepted
            $('.dropdown-item')[6].click()
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


        function Revwr_checkFinishDisable(done) {
            //S'ha de provar de clicar el boto de Finish
            //Mirar que no es mostra cap modal
            $(".finish-task-action").click()
            this.waitUntilEl('.modal.fade.modal-template-view.view-attached:not(.show.in)', function (res) {
                this.assert(res, true, "No apareix cap modal")
                done();
            });
        },

        function Revwr_checkHelpModal(done) {
            //S'ha de clicar al boto de help
            //Mirar que apareix la modal de Help
            //Mirar que conte informació
            //Mirar que clicant fora no desapareix la modal
            //Mirar que es pot tancar la modal fent click a la creueta o close
            //Mirar que desapareix la Modal

            $(".get-help-action").click();
            $(".get-help-action").change();

            this.waitUntilEl('.modal.fade.modal-template-view.view-attached.show.in', function (res) {
                this.assert(res, true, 'Apareix la modal help');
                this.waitUntilConditionAccomplished(() => ($(".modal-body table td")[7].firstChild.nodeValue == "Accept subtitle"), function (res) {
                    this.waitUntilConditionAccomplished(() => ($(".modal-body table td")[23].firstChild.nodeValue == "Accepted subtitle"), function (res) {
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

        function Revwr_checkTitleAndDescription(done) {
            //Mirar que te la clase redtitle
            //S'ha de clicar el "boto" title and description
            //Mirar que es mostra la modal de title and description i que te contingut
            //S'ha de clicar el boto close
            //Mirar que es tanca la modal
            //Mirar que continua tenint la clase redtitle
            //Tornar a clicar el boto per obrir la modal
            this.waitUntilEl('.edit-action.R-edit-title-description.redtitle', function (res) {
                this.assert(res, true, "Titol i descripcio tenen la classe redtitle")
                $(".edit-action.R-edit-title-description.redtitle:eq(0)").click()
                $("a.edit-action").trigger('click')
                $("a.edit-action").change()

                this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached.show.in', function (res) {
                    this.assert(res, true, "Es mostra la modal de title i description")
                    this.assert(res, true, 'La capsa esta en verd');
                    $(".close-action").trigger('click')
                    $(".close-action").change()

                    this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                        this.waitUntilConditionAccomplished(() => ($('.modal-backdrop.fade.show').length == 0), function (res) {
                            this.waitUntilConditionAccomplished(() => ($('.modal-backdrop.fade.in').length == 0), function (res) {
                                this.assert(res, true, "La modal es tanca correctament")
                                done();
                            });
                        });
                    });
                });
            });
        },

        function Revwr_checkTitleEdition(done) {
            //Mirar que hi ha contingut en el Translated title
            //S'ha de clicar sobre el translated title
            //Mirar que apareix un input
            //S'ha de cambiar el text del titol per qualsevol cosa i provocar un event de change//input
            //Mirar que desapareix el input i es substitueix per un span que conte el text canviat
            //Mirar que aquest titol te la classe edited (es de color verd)
            //Mirar que aquest titol te la classe yellow
            this.waitUntilEl('.edit-action.R-edit-title-description.redtitle', function (res) {
                this.assert(res, true, "Titol i descripcio tenen la classe redtitle")
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

                            this.waitUntilEl('span.T-title.validated', function (res) {
                                this.assert(res, true, 'El span ha canviat');

                                this.waitUntilConditionAccomplished(() => ($('span.T-title.validated').html() == 'hola'), function (res) {
                                    this.assert(res, true, 'El span ha canviat correctament');

                                    this.waitUntilEl('.accepted.R-right.display-flex.justify-content', function (res) {
                                        this.assert(res, true, 'La capsa esta en verd');
                                        $("a.edit-action").trigger('click')
                                        $("a.edit-action").change()
                                        this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                                            this.waitUntilConditionAccomplished(() => ($('.modal-backdrop.fade.show').length == 0), function (res) {
                                                this.assert(res, true, "La modal es tanca correctament")
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

        function Revwr_checkTitleAndDescriptionButton2(done) {
            //Mirar que el Boto de edit title and description (DE LA PAGINA PRINCIPAL) te la clase ENCARA de redtitle
            this.waitUntilEl('.edit-action.R-edit-title-description.redtitle', function (res) {
                this.assert(res, true, "Titol i descripcio encara tenen la classe redtitle")
                done();
            });
        },

        function Revwr_checkSynopsisEdition(done) {
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
                        this.waitUntilEl('div.T-description.validated', function (res) {
                            this.assert(res, true, 'El div ha canviat');
                            this.waitUntilConditionAccomplished(() => ($('div.T-description.validated').html() == 'hola'), function (res) {
                                this.assert(res, true, 'El div ha canviat correctament');
                                this.waitUntilEl('.R-description .R-wrapper .R-right.accepted', function (res) {
                                    this.assert(res, true, 'La capsa esta en verd');
                                    $(".close-action").click()
                                    this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                                        this.waitUntilConditionAccomplished(() => ($('.modal-backdrop.fade.show').length == 0), function (res) {
                                            this.assert(res, true, "La modal es tanca correctament")
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


        function Revwr_AcceptTitleAndDescription(done) {
            //Sha de clicar el checkbox de title
            //Mirar que el títol conte la clase accepted
            //Sha de clicar el checkbox de description
            //Mirar que la descripció conte la clase accepted
            //Mirar que el boto edit title and description de la pagina principal ja no te la clase redtitle
            $(".edit-action.R-edit-title-description")[0].click()
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
                            this.waitUntilConditionAccomplished(() => ($('.modal-backdrop.fade.show').length == 0), function (res) {
                                this.assert(res, true, "La modal es tanca correctament")
                                this.waitUntilEl('.edit-action.R-edit-title-description:not(.redtitle)', function (res) {
                                    this.assert(res, true, "Titol i descripcio no tenen la classe redtitle")
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        },

        function Revwr_checkTitleUndo(done) {
            //Sha de clicar el undo de title
            //Mirar que el titol ha tornat a un estat base sense accepted, yellow/ conflict
            //Mirar que el títol ha tornat al estat automatic
            $(".edit-action.R-edit-title-description")[0].click()
            this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached.show.in', function (res) {
                this.assert(res, true, "Es mostra la modal de title i description")
                $('.undo-title-action').click()
                this.waitUntilEl('.R-title .R-wrapper .R-right.accepted', function (res) {
                    this.waitUntilConditionAccomplished(() => ($('.T-title:eq(1)').html() != 'hola'), function (res) {
                        this.assert(res, true, 'El títol torna al automatic');
                        done();
                    });
                });
            });
        },

        function Revwr_checkSynopsisUndo(done) {
            //Sha de clicar el undo de description
            //Mirar que la descripció ha tornat a un estat base sense accepted, yellow/ conflict
            //Mirar que la descripció ha tornat al estat automatic
            $('.undo-synopsis-action').click()
            this.waitUntilEl('.R-description .R-wrapper .R-right.accepted', function (res) {
                this.assert(res, true, 'La sinopsis no te estat accepted');
                this.waitUntilConditionAccomplished(() => ($('.T-description:eq(1)').html() != 'hola'), function (res) {
                    this.assert(res, true, 'La sinopsis torna al automatic');
                    done();
                });
            });
        },

        function Revwr_checkCloseTitleAndDescriptionByX(done) {
            //S'ha de clicar el Botó X de la cantonada superior dreta
            //Mirar que la modal es tanca
            //Mirar que el boto edit title and description ja te la clase redtitle
            $('.close-action').click()
            this.waitUntilEl('.modal.fade.modal-title-description-view.view-attached:not(show.in)', function (res) {
                this.assert(res, true, "La modal es tanca correctament")
                done();
            });
        },


        function Revwr_checkStatsNo0(done) {
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

        function Revwr_checkPauseVideoWhileTypingButton(done) {
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

        function Revwr_checkButtonSaveModal(done) {
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

        function Revwr_acceptAllBoxes(done) {
            //Acceptar totes les capses
            //Acceptar titol i sinopsis
            //Mirar si el boto de finish ja no te l'atribut disabled   
            done();
        },

        function Revwr_checkRejectModal(done) {
            //Fer click al boto reject Modal
            //Mirar que s'obre la modal de Reject (comprovar el titol)
            $(".reject-progress-action").click()
            $(".reject-progress-action").change()
            this.waitUntilEl('.modal.fade.modal-template-view.view-attached.show.in', function (res) {
                this.assert(res, true, "Apareix una modal")
                done();
            });
        },

    ]
})