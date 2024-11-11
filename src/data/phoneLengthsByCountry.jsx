// Validación de número de teléfono
const phoneLengthsByCountry = {
  "+93": 9,    // Afganistán
  "+355": 9,   // Albania
  "+49": 11,   // Alemania
  "+376": 6,   // Andorra
  "+244": 9,   // Angola
  "+1": 10,    // Antigua y Barbuda
  "+966": 9,   // Arabia Saudita
  "+213": 9,   // Argelia
  "+54": 10,   // Argentina
  "+374": 8,   // Armenia
  "+297": 7,   // Aruba
  "+61": 9,    // Australia
  "+43": 13,   // Austria
  "+994": 9,   // Azerbaiyán
  "+1": 10,    // Bahamas
  "+973": 8,   // Baréin
  "+880": 10,  // Bangladés
  "+1": 10,    // Barbados
  "+375": 9,   // Bielorrusia
  "+32": 9,    // Bélgica
  "+501": 7,   // Belice
  "+229": 8,   // Benín
  "+975": 8,   // Bután
  "+591": 8,   // Bolivia
  "+387": 8,   // Bosnia y Herzegovina
  "+267": 7,   // Botsuana
  "+55": 11,   // Brasil
  "+359": 8,   // Bulgaria
  "+226": 8,   // Burkina Faso
  "+257": 6,   // Burundi
  "+855": 9,   // Camboya
  "+237": 9,   // Camerún
  "+1": 10,    // Canadá
  "+238": 7,   // Cabo Verde
  "+345": 8,   // Islas Caimán
  "+236": 7,   // República Centroafricana
  "+61": 9,    // Chile
  "+86": 11,   // China
  "+57": 10,   // Colombia
  "+269": 7,   // Comoras
  "+242": 12,  // Congo (República del)
  "+243": 9,   // Congo (República Democrática del)
  "+682": 5,   // Islas Cook
  "+506": 8,   // Costa Rica
  "+385": 10,  // Croacia
  "+53": 8,    // Cuba
  "+357": 8,   // Chipre
  "+420": 9,   // Chequia
  "+45": 8,    // Dinamarca
  "+253": 7,   // Yibuti
  "+1767": 10, // Dominica
  "+1": 10,    // República Dominicana
  "+593": 9,   // Ecuador
  "+20": 10,   // Egipto
  "+503": 8,   // El Salvador
  "+240": 9,   // Guinea Ecuatorial
  "+291": 8,   // Eritrea
  "+372": 7,   // Estonia
  "+251": 10,  // Etiopía
  "+500": 4,   // Islas Malvinas
  "+298": 6,   // Islas Feroe
  "+679": 7,   // Fiji
  "+358": 9,   // Finlandia
  "+33": 10,   // Francia
  "+241": 7,   // Gabón
  "+220": 7,   // Gambia
  "+995": 9,   // Georgia
  "+49": 11,   // Alemania
  "+233": 9,   // Ghana
  "+350": 5,   // Gibraltar
  "+30": 10,   // Grecia
  "+299": 7,   // Groenlandia
  "+147": 4,   // Guam
  "+502": 8,   // Guatemala
  "+44": 10,   // Reino Unido
  "+224": 9,   // Guinea
  "+245": 7,   // Guinea-Bisáu
  "+592": 7,   // Guayana
  "+509": 9,   // Haití
  "+36": 9,    // Hungría
  "+354": 7,   // Islandia
  "+91": 10,   // India
  "+62": 10,   // Indonesia
  "+98": 10,   // Irán
  "+964": 10,  // Irak
  "+353": 9,   // Irlanda
  "+972": 9,   // Israel
  "+39": 10,   // Italia
  "+225": 10,  // Costa de Marfil
  "+81": 10,   // Japón
  "+962": 9,   // Jordania
  "+7": 11,    // Kazajistán
  "+254": 10,  // Kenia
  "+686": 5,   // Kiribati
  "+965": 8,   // Kuwait
  "+996": 9,   // Kirguistán
  "+856": 8,   // Laos
  "+371": 8,   // Letonia
  "+961": 8,   // Líbano
  "+266": 8,   // Lesoto
  "+231": 7,   // Liberia
  "+218": 10,  // Libia
  "+370": 8,   // Lituania
  "+352": 6,   // Luxemburgo
  "+853": 8,   // Macao
  "+389": 8,   // Macedonia del Norte
  "+261": 9,   // Madagascar
  "+265": 8,   // Malaui
  "+60": 10,   // Malasia
  "+960": 7,   // Maldivas
  "+223": 8,   // Malí
  "+356": 8,   // Malta
  "+692": 7,   // Islas Marshall
  "+596": 10,  // Martinica
  "+222": 8,   // Mauritania
  "+230": 8,   // Mauricio
  "+262": 9,   // Mayotte
  "+52": 10,   // México
  "+691": 7,   // Micronesia
  "+373": 8,   // Moldavia
  "+377": 8,   // Mónaco
  "+976": 8,   // Mongolia
  "+382": 8,   // Montenegro
  "+664": 10,  // Montserrat
  "+212": 9,   // Marruecos
  "+258": 9,   // Mozambique
  "+264": 9,   // Namibia
  "+674": 8,   // Nauru
  "+977": 10,  // Nepal
  "+31": 10,   // Países Bajos
  "+599": 10,  // Países Bajos Caribe
  "+64": 9,    // Nueva Zelanda
  "+505": 8,   // Nicaragua
  "+227": 8,   // Níger
  "+234": 10,  // Nigeria
  "+683": 5,   // Niue
  "+850": 8,   // Corea del Norte
  "+47": 8,    // Noruega
  "+968": 8,   // Omán
  "+92": 10,   // Pakistán
  "+680": 7,   // Palaos
  "+970": 9,   // Palestina
  "+507": 7,   // Panamá
  "+675": 7,   // Papúa Nueva Guinea
  "+595": 8,   // Paraguay
  "+51": 9,    // Perú
  "+63": 10,   // Filipinas
  "+48": 9,    // Polonia
  "+351": 9,   // Portugal
  "+1": 10,    // Puerto Rico
  "+974": 8,   // Catar
  "+40": 10,   // Rumanía
  "+7": 11,    // Rusia
  "+250": 9,   // Ruanda
  "+508": 6,   // San Pedro y Miquelón
  "+1": 10,    // San Vicente y las Granadinas
  "+249": 9,   // Sudán
  "+597": 7,   // Surinam
  "+47": 8,    // Suecia
  "+41": 9,    // Suiza
  "+963": 9,   // Siria
  "+886": 9,   // Taiwán
  "+992": 9,   // Tayikistán
  "+255": 9,   // Tanzania
  "+66": 9,    // Tailandia
  "+670": 7,   // Timor Oriental
  "+228": 8,   // Togo
  "+676": 4,   // Tonga
  "+1868": 10, // Trinidad y Tobago
  "+216": 8,   // Túnez
  "+90": 10,   // Turquía
  "+993": 8,   // Turkmenistán
  "+1": 10,    // Islas Turcas y Caicos
  "+688": 5,   // Tuvalu
  "+256": 9,   // Uganda
  "+380": 9,   // Ucrania
  "+971": 9,   // Emiratos Árabes Unidos
  "+44": 10,   // Reino Unido
  "+1": 10,    // Estados Unidos
  "+598": 8,   // Uruguay
  "+998": 9,   // Uzbekistán
  "+678": 7,   // Vanuatu
  "+39": 10,   // Ciudad del Vaticano
  "+58": 10,   // Venezuela
  "+84": 9,    // Vietnam
  "+681": 5,   // Wallis y Futuna
  "+967": 9,   // Yemen
  "+260": 9,   // Zambia
  "+263": 9,   // Zimbabue
};

export default phoneLengthsByCountry;