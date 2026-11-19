// Listas cerradas de catálogo para los formularios de creación/edición.
// Los valores se guardan tal cual en Postgres: respetar tildes y mayúsculas.
// Basadas en backup_MUIGUPTCDB_clean.sql. Donde el backend indica "nullable",
// el <select> arranca vacío (value "").

// ---------- FÓSIL ----------
export const FOSIL_COLECCIONES = [
  "Colección Laboratorio UPTC",
  "Donación",
  "Museo Geológico Nacional",
  "Colección Diego Suarez",
  "Colección Familia Sateja",
  "Colección Hernando Torres",
  "MGNJRG",
  "SGC-MGNJRG",
];

export const FOSIL_FILOS = [
  "Porifera",
  "Cnidaria",
  "Bryozoa",
  "Brachiopoda",
  "Mollusca",
  "Annelida",
  "Arthropoda",
  "Echinodermata",
  "Hemichordata",
  "Chordata",
  "Cyanobacteria",
  "Plantae",
  "Otro",
];

export const FOSIL_SUBFILOS = ["Vertebrata", "Trilobitomorpha", "Otro"];

export const FOSIL_CLASES = [
  "Cephalopoda",
  "Bivalvia",
  "Gastropoda",
  "Mammalia",
  "Sauropsida",
  "Reptilia",
  "Anthozoa",
  "Echinoidea",
  "Crinoidea",
  "Chondrichthyes",
  "Trilobita",
  "Inarticulata",
  "Strophomenata",
  "Gymnolaemata",
  "Otro",
];

export const FOSIL_ORDENES = [
  "Proboscidea",
  "Crocodilia",
  "Spatangoida",
  "Testudines",
  "Trigoniida",
  "Ostreoida",
  "Cryptostomata",
  "Strophomenidina",
  "Rugosa",
  "Tabulata",
  "Spiriferida",
  "Rodentia",
  "Cassiduloida",
  "Lepidodendrales",
  "Strophomenida",
  "Otro",
];

export const FOSIL_FAMILIAS = [
  "Toxasteridae",
  "Trigoniidae",
  "Ostreidae",
  "Micheliinidae",
  "Fenestellidae",
  "Gryphaeidae",
  "Zaphrentidae",
  "Echinolampadidae",
  "Pleurodictyum",
  "Otro",
];

export const TIEMPOS_GEOLOGICOS_FOSIL = [
  "Cenozoico",
  "Mesozoico",
  "Paleozoico",
  "Devónico",
  "Cretácico",
  "Holoceno (Actual)",
  "Campaniense a Maastrichtiense",
  "Desconocido",
];

export const FOSIL_VITRINAS = [
  "P1-P2",
  "O1-O2",
  "N1-N2",
  "Q1 - Q2",
  "Vitrina Vertebrados",
  "Vitrina Devónico",
  "Vitrina Amonitas",
  "Vitrina Amonitas Puerta 2",
  "Vitrina del Cenozoico",
  "Vitrina del Mesozoico",
  "Vitrina del Paleozoico",
  "Vitrina Cenozoico",
  "Vitrina Paleozoico",
  "Vitrina Paleobotánica",
  "Vitrina D1-D2",
  "Panel Paleontología",
  "Panel Ingeniería Geológica",
  "Base vitrina amonitas",
  "Soporte estromatolitos",
  "Cajón",
  "Bodega Cajon 4",
];

// ---------- MINERAL ----------
export const MINERAL_COLECCIONES = [
  "Colección Laboratorio UPTC",
  "Colección Laboratorio",
  "Colección El Tiempo 1",
  "Colección Del Tiempo 2",
  "Colección H. Torres",
  "Colección Wards Set 1",
  "Colección Wards Set 2",
  "Colección Wards Set 3",
  "Colección Wards Set 4",
  "Colección Familia Sateja",
  "Colección Hernando Torres",
  "Donación",
  "Asociada a Investigación",
];

export const GRUPOS_MINERALOGICOS = [
  "Nativo",
  "Sulfuro",
  "Óxido",
  "Haluro",
  "Carbonato",
  "Borato",
  "Sulfato",
  "Fosfato",
  "Silicato",
  "Hidróxido",
  "Feldespato",
  "Vidrio Natural",
  "No Mineral",
  "Otro",
];

export const SUBGRUPOS_MINERALOGICOS = [
  "Nesosilicato",
  "Sorosilicato",
  "Ciclosilicato",
  "Inosilicato",
  "Filosilicato",
  "Tectosilicato",
  "Metal",
  "Semimetal",
  "Espinela",
  "Otro",
];

// ---------- ROCA ----------
export const ROCA_TIPOS = ["Sedimentaria", "Ígnea", "Metamórfica", "Otro"];

export const ROCA_COLECCIONES = [
  "Colección Laboratorio UPTC",
  "Donación",
  "Colección Familia Sateja",
];

export const DEPARTAMENTOS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
  "Bogotá D.C.",
  "Exterior",
  "Desconocido",
];

// ---------- INVESTIGACIÓN ----------
export const INVESTIGACION_COLECCIONES = [
  "Ilustración Cientifica Devónico Medio. Ilustración Cientifica y Realidad aumentada. 2021",
  "Sedimentología y caracterización como roca generadora de hidrocarburos de la Formación Floresta, Macizo de Floresta, Colombia. 2020",
  "Palaeoredox conditions and sequence stratigraphy of the Cretaceous storm-dominated, mixed siliciclastic-carbonate ramp in the Eastern Cordillera Basin (Colombia): Evidence from sedimentary geochemical proxies and facies analysis. Rivera et al. 2018",
];

export const PERIODOS_GEOLOGICOS = [
  "Cámbrico",
  "Ordovícico",
  "Silúrico",
  "Devónico",
  "Carbonífero",
  "Pérmico",
  "Triásico",
  "Jurásico",
  "Cretácico",
  "Paleógeno",
  "Neógeno",
  "Cuaternario",
  "Holoceno",
  "Desconocido",
];

export const ERAS_GEOLOGICAS = [
  "Paleozoico",
  "Mesozoico",
  "Cenozoico",
  "Precámbrico",
];

// ---------- PERFIL ----------
export const TIPOS_IDENTIFICACION = [
  "Cédula de Ciudadanía",
  "Tarjeta de Identidad",
  "Cédula de Extranjería",
  "Tarjeta de Extranjería",
];

export const GENEROS = ["Femenino", "Masculino", "Otro"];

export const ROLES = [
  { valor: "1", etiqueta: "Usuario normal" },
  { valor: "2", etiqueta: "Administrador" },
  { valor: "3", etiqueta: "Superadministrador" },
];

export const ESTADOS_CUENTA = ["ACTIVO", "BLOQUEADO"];
