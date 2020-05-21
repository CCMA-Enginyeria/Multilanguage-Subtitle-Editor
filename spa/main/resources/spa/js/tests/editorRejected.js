
define([],function(){


    var focusedBox =  "tr.focus.subtitle-box-replaced-view"
    var focusedSimpleBox =  "tr.focus.simple-subtitle-box-replaced-view"
    var video = '#my-video'
    var largeText = "This is the largest text you should encounter in a subtitle and will provoke a Large text conflict"
    var Subtitles = ".subtitle-box-replaced-view";
    var AcceptedBoxes = "tr.subtitle-box-replaced-view.accepted";
    var ConflictBoxes = "tr.subtitle-box-replaced-view.reject";
    var YellowBoxes = "tr.subtitle-box-replaced-view.yellow";
    
    clickAcceptCheckBox = function(BoxToAccept){
        BoxToAccept.find('.accept-action').click()
    }

    getRandomUnusedBoxElement = function(){
        return $("tr.subtitle-box-replaced-view:not(.accepted):not(.reject):not(.yellow)")[Math.floor((Math.random()* $(".subtitle-box-replaced-view").length))]
    }
    doFocus = function(Element){
        Element[0].children[0].click()
    }

    return [
        function EditorRejected_checkHeader(done){
            window.location.href = "#editor?userid=32435&token=fdskk2315dasbgfn&job=0011"
            this.waitUntilEl("h1:contains(Subtitles Editor)",function(res){
                this.assert(res,true,'LA pàgina té h1');
                done();
            });
        },


        function EditorRejected_checkInitialSubtitles(done){
            //Mirar que hi han subtitols
            //Mirar que hi han subtitols acceptats
            //Mirar que hi han subtitols conflictats
            done();
        },

        function EditorRejected_checkTitleAndDescription(done){      
            //Mirar que hi ha titol/descripció acceptat o conflictat, un dels dos
            done();
        },
        //Podriem fer 1000 checks de que la pagina esta carregada correctament        
        /////////Provarem que la modal de help es desplega i es pot tancar (i te continugt correcte)
        /////////Provarem que hi han simple subtitle box carregat
        /////////Provarem que hi han barres carregades


        function EditorRejected_checkFinishEnabled(done){
            //Mirar que el botó de finish esta enabled de bon inici
            done();
        },
        
        function EditorRejected_checkHelpModal(done){
            //S'ha de clicar al boto de help
            //Mirar que apareix la modal de Help
            //Mirar que conte informació
            //Mirar que clicant fora no desapareix la modal
            //Mirar que es pot tancar la modal fent click a la creueta o close
            //Mirar que desapareix la Modal
            done();
        },

        function EditorRejected_testBoxFocusSingleLine(done){            
            doFocus($(".subtitle-box-replaced-view:eq(2)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(2).focus",function(res){
                this.assert(res,true,'La capsa 2 te focus');
                done();
            });            
        },

        function EditorRejected_testBoxFocusDoubleLine(done){            
            doFocus($(".subtitle-box-replaced-view:eq(1)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(1).focus",function(res){
                this.assert(res,true,'La capsa 1 te focus');
                done();
            });            
        },

        //Focus from collection de una capsa amb double line
        function EditorRejected_testBoxFocusFromCollection(done){
            doFocus($(".subtitle-box-replaced-view:eq(4)"));
            this.waitUntilEl(".subtitle-box-replaced-view:eq(4).focus",function(res){
                this.assert(res,true,"La capsa 4 te focus")
                this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(4).focus",function(res){
                    this.assert(res,true,'Les capses de la col·lecció i el video concorden')
                    done();
                    this.waitUntilEl(".simple-subtitle-box-replaced-view:eq(4).focus",function(res){
                        this.assert(res,true,'Les capses de la col·lecció i el video concorden')
                        
                    });
                })
            })
            //Mirar que el begintime d'aquesta capsa concorda amb el temps on esta el video colocat
            //Mirar que e begintime de la capsa que esta focused en el timeline concorda amb el de simplesubtitle fet focus
            //Mirar que el subtitol renderitzat concorda amb el text dintre de la capsa
            
        },

        //Testejar per una capsa que tingui 2 linies
        function EditorRejected_testSimpleBoxFocusFromCollection(done){
            //S'ha d'agafar una capsa random unaltered de la coleccio de capses petites
            //S'ha de fer click a aquesta capsa
            //Mirar que aquesta capsa conte focus
            //Mirar que el begintime d'aquesta capsa concorda amb el temps on esta el video colocat
            //Mirar que e begintime de la capsa que esta focused en el timeline concorda amb el del subtitel fet focus
            //Mirar que el subtitol renderitzat concorda amb el text dintre de la capsa
            done();
        },

        function EditorRejected_testVideoFocus(done){
            //S'ha de setejar el temps del video a un número aleatori (dintre de les posibilitats del video)
            //Mirar que una capsa dintre de la col·lecció te focus i que aquesta capsa te begin/endtime dintre del temps del video
            //Mirar que una capsa dintre de la col·lecció SIMPLE te focus i que aquesta capsa te begin/endtime dintre del temps del video            
            done();
        },



        function EditorRejected_testVideoRunningFocus(done){
            //S'ha d'agafar un temps aleatori amb <1min abans del final minim
            //S'ha de fer play al video
            //Mirar que el video esta corrent
            //Mirar que passat un temps s'han recorregut X subtitols
            done();
        },

        function EditorRejected_unableToChangeAcceptedSubtitle(done){
            //S'ha de clicar una capsa
            //Mirar que aquella capsa te focus
            //S'ha de tornar a clicar la mateixa capsa
            //Mirar que aquella capsa NO TE CAP INPUT
            //S'ha de intentar cambiar el subtitol de la capsa
            //Mirar que no s'ha cambiat el subtitol de la capsa
        },


        function EditorRejected_changeSubtitleTextRejected(done){
            //APLICAR AQUEST MATEIX PROCEDIMENT A UNA CAPSA REJECTED



            // doFocus($(".subtitle-box-replaced-view:eq(10)"))
            // this.waitUntilEl(".subtitle-box-replaced-view:eq(10).focus", function(res){    
            //     this.assert(res, true, "La capsa 10 te focus")                    
            //     doFocus($(".subtitle-box-replaced-view:eq(10)"))
            //     this.waitUntilEl(".subtitle-box-replaced-view:eq(10).focus input.proposed-modified-action", function(res){
            //         this.assert(res, true, "Ha aparegut el input en la capsa focused")
            //         $(".subtitle-box-replaced-view:eq(10) input").val("Soc una patata")
            //         this.waitUntilEl($(".subtitle-box-replaced-view:eq(10) input").val() == 'Soc una patata',function(res){
            //             this.assert(res,true,"Cambiar el text del subtitol ha funcionat")
            //             $(".subtitle-box-replaced-view:eq(10) input.proposed-modified-action").trigger('input')
            //             $(".subtitle-box-replaced-view:eq(10) input.proposed-modified-action").change()                        
            //         });
            //     });
            // });
        },
        
        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_doubleLineFirstSubtitleChange(){
            //S'ha d'apretar a una capsa
            //Mirar si s'ha fet focus
            //S'ha d'apretar de nou la mateixa capsa
            //Mirar que s'han obert els dos inputs
            //S'ha d'ecriure text nou (s'ha de forçar el change i el input)
            //S'ha de fer focus a una altra capsa
            //Mirar si l'altra capsa te focus
            //Mirar si la capsa modificada s'ha posat en groc
            //Mirar si el text a canviat
            //Mirar si el text s'ha posat en verd
            //Mirar si el text del segon input no ha canviat
        },

        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_doubleLineSecondSubtitleChange(){
            //S'ha d'apretar a una capsa
            //Mirar si s'ha fet focus
            //S'ha d'apretar de nou la mateixa capsa
            //Mirar que s'han obert els dos inputs
            //S'ha d'apretar el segon input
            //S'ha d'ecriure text nou al segon input (s'ha de forçar el change i el input)
            //S'ha de fer focus a una altra capsa
            //Mirar si l'altra capsa te focus
            //Mirar si la capsa modificada s'ha posat en groc
            //Mirar si el text del segon input ha canviat
            //Mirar si el text s'ha posat en verd
            //Mirar si el text del primer input no ha canviat

        },

        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_doubleLineBothSubtitleChange(){
            //S'ha d'apretar a una capsa
            //Mirar si s'ha fet focus
            //S'ha d'apretar de nou la mateixa capsa
            //Mirar que s'han obert els dos inputs
            //S'ha d'ecriure text nou (s'ha de forçar el change i el input)
            //S'ha d'apretar el segon input
            //S'ha d'ecriure text nou al segon input (s'ha de forçar el change i el input)
            //S'ha de fer focus a una altra capsa
            //Mirar si l'altra capsa te focus
            //Mirar si la capsa modificada s'ha posat en groc
            //Mirar si el text del primer input ha canviat
            //Mirar si el text del segon input ha canviat
        },

        function EditorRejected_noUndoAction(done){
            //Mirar que el botó Undo esta deshabilitat per al editorRejected
            //Intentar clicar el boto Undo
            //Mirar que no es produeix cap canvi
        },



        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_cancelEditionBasic(done){
            //S'ha d'emmagatzemar el text Automatic.
            //S'ha d'agafar una capsa i provocarli un canvi a proposed modified input
            //S'ha de fer un click al boto que conté la acció "cancel-action"
            //Mirar que es retorna al text Automatic
            done(); 
        },

        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_cancelEditionExtended(done){
           //S'ha de cambiar el text d'una capsa
            //S'ha de clicar el checkBox per acceptar el subtitol i comprovar que es posa en verd
            //S'ha de guardar aquest valor en una nova variable per comprovar despres
            //S'ha de canviar el text i fer click al cancel-edition per comprovar que s'ha tornat al text amb la variable guardada
            /////////////REPETIR PROCES 2 COPS?////////////
            done();
        },

        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_emptySubtitle(done){
            //S'ha de agafar una capsa i buidarli el text del input (Intentar que sigui una capsa d'una sola linea)
            //Mirar que despres de perdre el focus es manté buit el span
            //Mirar que passa a un estat de "yellow"
            done();
        },

        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_largeTextChecker(done){
            //S'ha de agafar una capsa i posarli com a text al input un text molt llarg
            //Mirar que apareix el warning de text llarg
            //Mirar que si possem un subtitol curt "Hola", desapareix el warning
            done();
        },

        //NOMES FUNCIONAL PER A REJECTED
        function EditorRejected_largeTextCheckerHidden(done){
            //S'ha de agafar la capsa del text anterior
            //S'ha de posar un text curt "Hola"
            //Mirar que desapareix el canvi un cop fet el change i el input
            done();
        },


        function EditorRejected_testFilterOpen(done){
            //S'ha de clicar el dropdown toggle
            //Mirar que el dropdown s'ha obert
            done();
            $('.dropdown-toggle').click()
            this.waitUntilEl(".R-dropdown.open.show", function(res){   
                this.assert(res, true, "El filtre s'ha desplegat")
            });
        },

        //Realitzar aquest test en funció de la quantitat de resultats que provenen dels altres tests
        function EditorRejected_filterAcceptedSubtitles(done){
            doFocus($(".subtitle-box-replaced-view:eq(100)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(100).focus", function(res){   
                this.assert(res, true, "La capsa 100 te focus")   
                doFocus($(".subtitle-box-replaced-view:eq(103)"))
                this.waitUntilEl(".subtitle-box-replaced-view:eq(103).focus", function(res){   
                    this.assert(res, true, "La capsa 103 te focus")     
                    $(".subtitle-box-replaced-view:eq(103) .accept-subtitlebox-action").click()
                    this.waitUntilEl(".subtitle-box-replaced-view:eq(103).accepted", function(res){   
                        this.assert(res, true, "La capsa 103 s'ha acceptat")
                        $(".subtitle-box-replaced-view:eq(100) .accept-subtitlebox-action").click()
                        this.waitUntilEl(".subtitle-box-replaced-view:eq(100).accepted", function(res){   
                            this.assert(res, true, "La capsa 100 s'ha acceptat")
                            $('.dropdown-item')[1].click()
                            this.waitUntilEl(".dropdown-toggle:contains(Accepted)", function(res){   
                                this.assert(res, true, "El filtre ha cambiat a accepted")
                                $("a.refresh-filter-action").click()
                                this.waitUntilEl(".subtitle-box-replaced-view:eq(101)[hidden]", function(res){   
                                    this.assert(res, true, "La capsa 101 esta amagada")
                                    done();         
                                    //Mirar que la capsa 103 i 100 estan mostrades                       
                                });
                            });
                        });
                    });
                });
            });
        },

        function EditorRejected_testFocusHidden(done){
            //S'ha de fer focus a la capsa 100
            //S'ha de treure l'acceptar de la capsa 100
            //Mirar que el focus esta a la 103

            doFocus($(".subtitle-box-replaced-view:eq(100)"))
            this.waitUntilEl(".subtitle-box-replaced-view:eq(100).focus", function(res){
                this.assert(res,true,"La capsa 100 te focus")
                $('.subtitle-box-replaced-view:eq(100) input.accept-subtitlebox-action')[0].click()
                this.waitUntilEl(".subtitle-box-replaced-view:eq(103).focus", function(res){
                    this.assert(res,true,"El focus ha saltat correctament a la capsa 103")
                    done()
                });
            });

        },

        function EditorRejected_filterPendingSubtitles(done){
            //Mateix proceés que en accepted
            done();
        },

        function EditorRejected_filterAcceptedAndEditedSubtitles(done){
            //Mateix proceés que en accepted
            done();
        },

        function EditorRejected_filterConflictSubtitles(done){
            //Filtrar per conflicte--> no hi han capses
            done();
        },

        function EditorRejected_filterEmptySubtitles(done){
            //Mateix proceés que en accepted
            done();
        },
        

        function EditorRejected_checkTitleAndDescription(done){            
            //Mirar que te la clase redtitle
            //S'ha de clicar el "boto" title and description
            //Mirar que es mostra la modal de title and description i que te contingut
            //S'ha de clicar el boto close
            //Mirar que es tanca la modal
            //Mirar que continua tenint la clase redtitle
            //Tornar a clicar el boto per obrir la modal
            done();    
        },
        
        function EditorRejected_checkTitleEdition(done){         
            //Mirar que hi ha contingut en el Translated title
            //S'ha de clicar sobre el translated title
            //Mirar que apareix un input
            //S'ha de cambiar el text del titol per qualsevol cosa i provocar un event de change//input
            //Mirar que desapareix el input i es substitueix per un span que conte el text canviat
            //Mirar que aquest titol te la classe edited (es de color verd)
            //Mirar que aquest titol te la classe yellow
            done();      
        },

        function EditorRejected_checkTitleAndDescriptionButton2(done){
            //Mirar que el Boto de edit title and description (DE LA PAGINA PRINCIPAL) te la clase ENCARA de redtitle 
            done();              
        },

        function EditorRejected_checkSynopsisEdition(done){
            //Mirar que hi ha contingut en el Translated synopsis
            //S'ha de clicar sobre el translated synopsis
            //Mirar que apareix un textarea
            //S'ha de cambiar el text del titol per qualsevol cosa i provocar un event de change//input
            //Mirar que desapareix el textarea i es substitueix per un span que conte el text canviat
            //Mirar que aquest titol te la classe edited (es de color verd)
            //Mirar que aquest titol te la classe yellow
            done();    
        },


        function EditorRejected_AcceptTitleAndDescription(done){
            //Sha de clicar el checkbox de title
            //Mirar que el títol conte la clase accepted
            //Sha de clicar el checkbox de description
            //Mirar que la descripció conte la clase accepted
            //Mirar que el boto edit title and description de la pagina principal ja no te la clase redtitle
            done();    
        },


        function EditorRejected_checkTitleUndo(done){
            //Sha de clicar el undo de title
            //Mirar que el titol ha tornat a un estat base sense accepted, yellow/ conflict
            //Mirar que el títol ha tornat al estat automatic
            done();    
        },

        function EditorRejected_checkSynopsisUndo(done){
            //Sha de clicar el undo de description
            //Mirar que la descripció ha tornat a un estat base sense accepted, yellow/ conflict
            //Mirar que la descripció ha tornat al estat automatic
            done();    
        },

        function EditorRejected_checkCloseTitleAndDescriptionByX(done){
            //S'ha de clicar el Botó X de la cantonada superior dreta
            //Mirar que la modal es tanca
            //Mirar que el boto edit title and description ja te la clase redtitle
            done();    
        },


        function EditorRejected_checkStatsNo0(done){
            //Mirar que la estadistica de viewed no es 0
            //Mirar que la estadistica de accepted no es 0
            //Mirar que la estadistica de edited no es 0
            done();    
        },

        function EditorRejected_checkPauseVideoWhileTypingButton(done){
            //Fer click al video per fer play
            //Mirar que el video esta en play mode
            //Realitzar un event de input per simular el premer una tecla
            //Mirar que el video ja no esta en play mode
            //Desactivar el pauseOnVideoWhileTyping
            //Fer click al video per fer play
            //Mirar que el video esta en play mode
            //Realitzar un event de input per simular el premer una tecla
            //Mirar que el video continui en estat play mode
            done();    
        },


        function EditorRejected_checkButtonSaveModal(done){
            //Fer click al boto save Modal
            //Mirar que s'obre la modal de Save (comprovar el titol)            
            done();    
        },


        function EditorRejected_setChangesForSaveCheck(done){
            //Fer edició a una capsa
            //Mirar que la capsa te l'estat yellow i el text edited (Y)
            //Fer acceptació a una altre capsa
            //Mirar que la capsa conté la clase accepted (X)
            //Fer acceptació i edició a una altre capsa
            //Mirar que la capsa te l'estat edited i accepted (Z)
            done();    
        },

        function EditorRejected_checkSave(done){
            //Clicar el botó de Save
            //Mirar que apareix la modal de Save (comprovar titol)
            //Fer click al boto accept
            //Esperar que aparegui la modal de success (comprovar titol de la modal)
            done();    
        },


        function EditorRejected_refreshAndCheckChanges(done){
            //Forçar un refresh de la pagina amb la mateixa URL
            //Mirar que la capsa Y continua tenint la clase yellow i text edited
            //Mirar que la capsa X continua tenint la clase accepted
            //Mirar que la capsa Z continua tenint la clase accepted i edited
            done();    
        },

        function EditorRejected_unSetChangesForSaveCheck(done){
            //Fer undo a la capsa Y
            //Mirar que la capsa Y no te estat accepted conflcit ni yellow
            //Mirar que el text de la capsa Y es el automatic
            //Fer undo a la capsa Z
            //Mirar que la capsa Z no te estat accepted conflcit ni yellow
            //Mirar que el text de la capsa Z es el automatic
            //Fer unaccept a la capsa X
            //Mirar que la capsa X no te la clase conflcit accepted ni yellow
            done();    
        },

        function EditorRejected_reCheckSave(done){
            //Clicar el botó de Save
            //Mirar que apareix la modal de Save (comprovar titol)
            //Fer click al boto accept
            //Esperar que aparegui la modal de success (comprovar titol de la modal)
            done();    
        },



        function EditorRejected_acceptAllBoxesAndTitleAndDescription(done){
            //Acceptar totes les capses
            //Acceptar titol i sinopsis
            //Mirar si el boto de finish ja no te l'atribut disabled            
            done();    
        },
    ]})