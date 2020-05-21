var mock_camps = [
  {
    "id": "id",
    "uid": "dtvc_metadata-assetid",
    "nom": "ID",
    "editable": false,
    "obligatori": false,
    "tipus": "INTEGER",
    "longitud": 8,
    "inputControl": "INTEGER",
    "ordenable": true
  },
  {
    "id": "titol",
    "uid": "dtvc_metadata-titol",
    "nom": "Títol",
    "ordre": 1,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 255,
    "inputControl": "TEXTAREA",
    "ordenable": true
  },
  {
    "id": "data",
    "uid": "dtvc_metadata-data_enviament",
    "nom": "Data",
    "ordre": 2,
    "editable": true,
    "obligatori": false,
    "tipus": "DATETIME",
    "longitud": 19,
    "inputControl": "DATETIME",
    "patro": "yyyy-MM-dd HH:mm:ss",
    "ordenable": true
  },
  {
    "id": "drets",
    "uid": "dtvc_metadata-drets",
    "nom": "Drets",
    "ordre": 3,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 255,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "tipusMaterial",
    "uid": "dtvc_metadata-tipus_material",
    "nom": "Material",
    "ordre": 4,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 3,
    "inputControl": "COMBO",
    "ordenable": true,
    "valors": [
      {
        "id": "AGS",
        "nom": "Notícia agència",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "ARX",
        "nom": "Arxiu",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "BLO",
        "nom": "Blocs",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "CAR",
        "nom": "Careta",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "CNT",
        "nom": "Contenidor",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "COM",
        "nom": "Competició, Partit Sencer",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "CRO",
        "nom": "Crònica",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "DOC",
        "nom": "Document",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "EDI",
        "nom": "Editat",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "EFE",
        "nom": "Efecte",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "ENV",
        "nom": "Enviament tràfic",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "EXT",
        "nom": "Retransmissions",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "FCT",
        "nom": "Fitxa Catàleg",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "GRA",
        "nom": "Grafisme",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "IMA",
        "nom": "Imatge",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "MOL",
        "nom": "Molinets",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "MST",
        "nom": "Master",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "MUS",
        "nom": "Música",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "ORI",
        "nom": "Original",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "OTR",
        "nom": "Original Transmissió",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PAR",
        "nom": "Paral.lel d'Antena",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PPD",
        "nom": "Preparat Per Difusió",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PPW",
        "nom": "Preparat per web",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PRG",
        "nom": "Promos genèriques",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PRO",
        "nom": "Projecte Natural News",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PRO",
        "nom": "Promos",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PRV",
        "nom": "Provisional",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "PUB",
        "nom": "Publicitat",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "REC",
        "nom": "Recurs",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "TRB",
        "nom": "Clip de treball",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "TRC",
        "nom": "Trailer",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "VCL",
        "nom": "Videoclip",
        "tipus": "MATERIAL_TYPE"
      },
      {
        "id": "VEU",
        "nom": "Voiceover",
        "tipus": "MATERIAL_TYPE"
      }
    ]
  },
  {
    "id": "titolEnviament",
    "uid": "dtvc_metadata-titol_enviament",
    "nom": "Env.",
    "ordre": 5,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 255,
    "inputControl": "TEXTAREA",
    "ordenable": true
  },
  {
    "id": "codi",
    "uid": "dtvc_metadata-numero_produccio_agencia",
    "nom": "Codi",
    "ordre": 6,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 50,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "productora",
    "uid": "dtvc_metadata-productora",
    "nom": "Productora",
    "ordre": 7,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 50,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "origen",
    "uid": "dtvc_metadata-origen",
    "nom": "Origen",
    "ordre": 8,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 50,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "assetIdPare",
    "uid": "dtvc_metadata-assetid_pare",
    "nom": "ID. Pare",
    "ordre": 9,
    "editable": true,
    "obligatori": false,
    "tipus": "INTEGER",
    "longitud": 10,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "suportArxiu",
    "uid": "dtvc_metadata-suport_arxiu",
    "nom": "Suport",
    "ordre": 10,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 100,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "autor",
    "uid": "dtvc_metadata-autor",
    "nom": "Autor",
    "ordre": 11,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 255,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "notes",
    "uid": "dtvc_metadata-notes",
    "nom": "Notes",
    "ordre": 12,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 255,
    "inputControl": "TEXTAREA",
    "ordenable": true
  },
  {
    "id": "text",
    "uid": "dtvc_metadata-text_agencia",
    "nom": "Text",
    "ordre": 13,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "inputControl": "TEXTAREA",
    "ordenable": true
  },
  {
    "id": "dataEmissio",
    "uid": "dtvc_metadata-data_emisio",
    "nom": "Data Emissió",
    "ordre": 14,
    "editable": true,
    "obligatori": false,
    "tipus": "DATE",
    "longitud": 10,
    "inputControl": "DATE",
    "patro": "yyyy-MM-dd",
    "ordenable": true
  },
  {
    "id": "horaEmisio",
    "uid": "dtvc_metadata-hora_emisio",
    "nom": "Hora Emis.",
    "ordre": 15,
    "editable": true,
    "obligatori": false,
    "tipus": "TIME",
    "longitud": 8,
    "inputControl": "TIME",
    "patro": "HH:mm:ss",
    "ordenable": true
  },
  {
    "id": "programaEmissio",
    "uid": "dtvc_metadata-programa_emisio",
    "nom": "Títol Emis.",
    "ordre": 16,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 100,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "timecodeSuportArxiu",
    "uid": "dtvc_metadata-timecode_suport_arxiu",
    "nom": "TC Suport",
    "ordre": 17,
    "editable": false,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 11,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "textPropi",
    "uid": "dtvc_metadata-text_propi",
    "nom": "Text propi",
    "ordre": 18,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "inputControl": "TEXTAREA",
    "ordenable": true
  },
  {
    "id": "format",
    "uid": "dtvc_metadata-format",
    "nom": "Format",
    "ordre": 19,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 10,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "audioCanals",
    "uid": "dtvc_metadata-audio_canals",
    "nom": "Canals Àudio",
    "ordre": 20,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 500,
    "inputControl": "TEXTAREA",
    "ordenable": true
  },
  {
    "id": "audioCodiConfiguracio",
    "uid": "dtvc_metadata-audio_codi_configuracio",
    "nom": "Configuració Àudio",
    "ordre": 21,
    "editable": true,
    "obligatori": false,
    "tipus": "STRING",
    "longitud": 50,
    "inputControl": "TEXT",
    "ordenable": true
  },
  {
    "id": "creat",
    "uid": "mc_assetmaster-CREAT",
    "nom": "Creació contingut",
    "ordre": 42,
    "editable": false,
    "obligatori": false,
    "tipus": "DATA_USER",
    "longitud": 1,
    "inputControl": "DATA_USER",
    "ordenable": true
  },
  {
    "id": "modificat",
    "uid": "mc_assetmaster-MODIFICAT",
    "nom": "Última Modificació",
    "ordre": 43,
    "editable": false,
    "obligatori": false,
    "tipus": "DATA_USER",
    "longitud": 1,
    "inputControl": "DATA_USER",
    "ordenable": true
  },
  {
    "id": "grup",
    "uid": "mc_assetmaster-GRUP",
    "nom": "Grup",
    "ordre": 44,
    "editable": false,
    "obligatori": false,
    "tipus": "GROUP",
    "longitud": 1,
    "inputControl": "GROUP",
    "ordenable": true
  },
  {
    "id": "medias",
    "uid": "mc_assetmaster-MEDIAS",
    "nom": "Vídeo i clips de vídeo",
    "ordre": 45,
    "editable": false,
    "obligatori": false,
    "tipus": "MEDIAS",
    "longitud": 1,
    "inputControl": "MEDIAS",
    "ordenable": true
  },
  {
    "id": "hqEstat",
    "uid": "mc_assetmaster-HQESTAT",
    "nom": "Video d'alta qualitat",
    "ordre": 46,
    "editable": false,
    "obligatori": false,
    "tipus": "HQSTATE",
    "longitud": 1,
    "inputControl": "HQSTATE",
    "ordenable": true
  },
  {
    "id": "bloquejos",
    "uid": "mc_assetmaster-BLOQUEJOS",
    "nom": "Num. bloqueig",
    "ordre": 47,
    "editable": false,
    "obligatori": false,
    "tipus": "LOCKS",
    "longitud": 1,
    "inputControl": "LOCKS",
    "ordenable": true
  }
];