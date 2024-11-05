import React, { useState, useEffect } from 'react';
//import { useParams } from "next/navigation";
//import { useRouter } from "next/router";  // Importa useRouter
import { useParams, useRouter } from 'next/navigation';
import axios from "axios";
import CountryFlag from 'react-country-flag';
import { isValidPhoneNumber } from "libphonenumber-js";
import LoginButtonGoogle from '../components/LoginButtonGoogle';
import LoginButtonFacebook from '../components/LoginButtonFacebook';

function UserForm({ mode = "user", onSubmit = () => {} }) {
  const params = useParams();
  const router = useRouter();  // Crea una instancia de useRouter

  const [formData, setFormData] = useState({
    role: "",
    firstname: "",
    secondname: "",
    doctype: "Cédula de ciudadanía (CC)", // Establece el tipo de documento por defecto aquí
    docnum: "",
    countryCode: "+57",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+57",
    country: "Colombia",
    flag: "CO",
    region: "América",
  });

  const [isValidPhone, setIsValidPhone] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [domainError, setDomainError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false); // Nuevo estado para controlar el enfoque
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //const allowedDomain = "@miempresa.com";

    const validateDomain = async () => {
      try {
        const response = await axios.post("/api/verify-email-domain", { email });
        if (!response.data.valid) {
          setDomainError("El dominio del correo electrónico no existe.");
        } else {
          setDomainError("");
        }
      } catch (error) {
          setDomainError("El dominio del correo electrónico no existe.");
      }
    };    
    //verificar

    if (emailTouched) { // Solo validamos si el campo ha sido tocado
      if (!emailPattern.test(formData.email)) {
        setEmailError("El formato del correo electrónico no es válido.");
      /*} else if (!formData.email.endsWith(allowedDomain)) {
        setEmailError(`El correo debe ser del dominio ${allowedDomain}.`);*/
      } else {
        setEmailError("");
      }
    }
  }, [formData.email, emailTouched]); // Añadir emailTouched a las dependencias

  useEffect(() => {
    if (formData.password.length > 0) {
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
      if (!passwordPattern.test(formData.password)) {
        setPasswordError("La contraseña debe cumplir con los requisitos.");
      } else if (formData.password !== formData.confirmPassword) {
        setPasswordError("Las contraseñas no coinciden.");
      } else {
        setPasswordError("");
      }
    }
  }, [formData.password, formData.confirmPassword]);

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


  const countryOptions = [
    { code: "+93", country: "Afganistán", flag: "AF", region: "Asia" },
    { code: "+355", country: "Albania", flag: "AL", region: "Europa" },
    { code: "+49", country: "Alemania", flag: "DE", region: "Europa" },
    { code: "+376", country: "Andorra", flag: "AD", region: "Europa" },
    { code: "+244", country: "Angola", flag: "AO", region: "África" },
    { code: "+1", country: "Antigua y Barbuda", flag: "AG", region: "Caribe" },
    { code: "+966", country: "Arabia Saudita", flag: "SA", region: "Asia" },
    { code: "+213", country: "Argelia", flag: "DZ", region: "África" },
    { code: "+54", country: "Argentina", flag: "AR", region: "Sudamérica" },
    { code: "+374", country: "Armenia", flag: "AM", region: "Asia" },
    { code: "+297", country: "Aruba", flag: "AW", region: "Caribe" },
    { code: "+61", country: "Australia", flag: "AU", region: "Oceanía" },
    { code: "+43", country: "Austria", flag: "AT", region: "Europa" },
    { code: "+994", country: "Azerbaiyán", flag: "AZ", region: "Asia" },
    { code: "+1242", country: "Bahamas", flag: "BS", region: "Caribe" },
    { code: "+973", country: "Baréin", flag: "BH", region: "Asia" },
    { code: "+880", country: "Bangladés", flag: "BD", region: "Asia" },
    { code: "+1246", country: "Barbados", flag: "BB", region: "Caribe" },
    { code: "+375", country: "Bielorrusia", flag: "BY", region: "Europa" },
    { code: "+32", country: "Bélgica", flag: "BE", region: "Europa" },
    { code: "+501", country: "Belice", flag: "BZ", region: "Caribe" },
    { code: "+229", country: "Benín", flag: "BJ", region: "África" },
    { code: "+975", country: "Bután", flag: "BT", region: "Asia" },
    { code: "+591", country: "Bolivia", flag: "BO", region: "Sudamérica" },
    { code: "+387", country: "Bosnia y Herzegovina", flag: "BA", region: "Europa" },
    { code: "+267", country: "Botsuana", flag: "BW", region: "África" },
    { code: "+55", country: "Brasil", flag: "BR", region: "Sudamérica" },
    { code: "+359", country: "Bulgaria", flag: "BG", region: "Europa" },
    { code: "+226", country: "Burkina Faso", flag: "BF", region: "África" },
    { code: "+257", country: "Burundi", flag: "BI", region: "África" },
    { code: "+855", country: "Camboya", flag: "KH", region: "Asia" },
    { code: "+237", country: "Camerún", flag: "CM", region: "África" },
    { code: "+1", country: "Canadá", flag: "CA", region: "América del Norte" },
    { code: "+238", country: "Cabo Verde", flag: "CV", region: "África" },
    { code: "+345", country: "Islas Caimán", flag: "KY", region: "Caribe" },
    { code: "+236", country: "República Centroafricana", flag: "CF", region: "África" },
    { code: "+61", country: "Chile", flag: "CL", region: "Sudamérica" },
    { code: "+86", country: "China", flag: "CN", region: "Asia" },
    { code: "+57", country: "Colombia", flag: "CO", region: "Sudamérica" },
    { code: "+269", country: "Comoras", flag: "KM", region: "África" },
    { code: "+242", country: "Congo (República del)", flag: "CG", region: "África" },
    { code: "+243", country: "Congo (República Democrática del)", flag: "CD", region: "África" },
    { code: "+682", country: "Islas Cook", flag: "CK", region: "Oceanía" },
    { code: "+506", country: "Costa Rica", flag: "CR", region: "América Central" },
    { code: "+385", country: "Croacia", flag: "HR", region: "Europa" },
    { code: "+53", country: "Cuba", flag: "CU", region: "Caribe" },
    { code: "+357", country: "Chipre", flag: "CY", region: "Europa" },
    { code: "+420", country: "Chequia", flag: "CZ", region: "Europa" },
    { code: "+45", country: "Dinamarca", flag: "DK", region: "Europa" },
    { code: "+253", country: "Yibuti", flag: "DJ", region: "África" },
    { code: "+1767", country: "Dominica", flag: "DM", region: "Caribe" },
    { code: "+1", country: "República Dominicana", flag: "DO", region: "Caribe" },
    { code: "+593", country: "Ecuador", flag: "EC", region: "Sudamérica" },
    { code: "+20", country: "Egipto", flag: "EG", region: "África" },
    { code: "+503", country: "El Salvador", flag: "SV", region: "América Central" },
    { code: "+240", country: "Guinea Ecuatorial", flag: "GQ", region: "África" },
    { code: "+291", country: "Eritrea", flag: "ER", region: "África" },
    { code: "+372", country: "Estonia", flag: "EE", region: "Europa" },
    { code: "+251", country: "Etiopía", flag: "ET", region: "África" },
    { code: "+500", country: "Islas Malvinas", flag: "FK", region: "África" },
    { code: "+298", country: "Islas Feroe", flag: "FO", region: "Europa" },
    { code: "+679", country: "Fiyi", flag: "FJ", region: "Oceanía" },
    { code: "+358", country: "Finlandia", flag: "FI", region: "Europa" },
    { code: "+33", country: "Francia", flag: "FR", region: "Europa" },
    { code: "+241", country: "Gabón", flag: "GA", region: "África" },
    { code: "+220", country: "Gambia", flag: "GM", region: "África" },
    { code: "+995", country: "Georgia", flag: "GE", region: "Asia" },
    { code: "+49", country: "Alemania", flag: "DE", region: "Europa" },
    { code: "+233", country: "Ghana", flag: "GH", region: "África" },
    { code: "+350", country: "Gibraltar", flag: "GI", region: "Europa" },
    { code: "+30", country: "Grecia", flag: "GR", region: "Europa" },
    { code: "+299", country: "Groenlandia", flag: "GL", region: "África" },
    { code: "+147", country: "Guam", flag: "GU", region: "Oceanía" },
    { code: "+502", country: "Guatemala", flag: "GT", region: "América Central" },
    { code: "+44", country: "Reino Unido", flag: "GB", region: "Europa" },
    { code: "+224", country: "Guinea", flag: "GN", region: "África" },
    { code: "+245", country: "Guinea-Bisáu", flag: "GW", region: "África" },
    { code: "+592", country: "Guayana", flag: "GY", region: "Sudamérica" },
    { code: "+509", country: "Haití", flag: "HT", region: "Caribe" },
    { code: "+504", country: "Honduras", flag: "HN", region: "América Central" },
    { code: "+852", country: "Hong Kong", flag: "HK", region: "Asia" },
    { code: "+36", country: "Hungría", flag: "HU", region: "Europa" },
    { code: "+354", country: "Islandia", flag: "IS", region: "Europa" },
    { code: "+91", country: "India", flag: "IN", region: "Asia" },
    { code: "+62", country: "Indonesia", flag: "ID", region: "Asia" },
    { code: "+98", country: "Irán", flag: "IR", region: "Asia" },
    { code: "+964", country: "Irak", flag: "IQ", region: "Asia" },
    { code: "+353", country: "Irlanda", flag: "IE", region: "Europa" },
    { code: "+972", country: "Israel", flag: "IL", region: "Asia" },
    { code: "+39", country: "Italia", flag: "IT", region: "Europa" },
    { code: "+225", country: "Costa de Marfil", flag: "CI", region: "África" },
    { code: "+81", country: "Japón", flag: "JP", region: "Asia" },
    { code: "+962", country: "Jordania", flag: "JO", region: "Asia" },
    { code: "+7", country: "Kazajistán", flag: "KZ", region: "Asia" },
    { code: "+254", country: "Kenia", flag: "KE", region: "África" },
    { code: "+686", country: "Kiribati", flag: "KI", region: "Oceanía" },
    { code: "+383", country: "Kosovo", flag: "XK", region: "Europa" },
    { code: "+965", country: "Kuwait", flag: "KW", region: "Asia" },
    { code: "+996", country: "Kirguistán", flag: "KG", region: "Asia" },
    { code: "+856", country: "Laos", flag: "LA", region: "Asia" },
    { code: "+371", country: "Letonia", flag: "LV", region: "Europa" },
    { code: "+961", country: "Líbano", flag: "LB", region: "Asia" },
    { code: "+266", country: "Lesoto", flag: "LS", region: "África" },
    { code: "+231", country: "Liberia", flag: "LR", region: "África" },
    { code: "+218", country: "Libia", flag: "LY", region: "África" },
    { code: "+423", country: "Liechtenstein", flag: "LI", region: "Europa" },
    { code: "+370", country: "Lituania", flag: "LT", region: "Europa" },
    { code: "+352", country: "Luxemburgo", flag: "LU", region: "Europa" },
    { code: "+261", country: "Madagascar", flag: "MG", region: "África" },
    { code: "+265", country: "Malaui", flag: "MW", region: "África" },
    { code: "+60", country: "Malasia", flag: "MY", region: "Asia" },
    { code: "+960", country: "Maldivas", flag: "MV", region: "Asia" },
    { code: "+223", country: "Malí", flag: "ML", region: "África" },
    { code: "+356", country: "Malta", flag: "MT", region: "Europa" },
    { code: "+692", country: "Islas Marshall", flag: "MH", region: "Oceanía" },
    { code: "+596", country: "Martiniqu", flag: "MQ", region: "Caribe" },
    { code: "+222", country: "Mauritania", flag: "MR", region: "África" },
    { code: "+230", country: "Mauricio", flag: "MU", region: "África" },
    { code: "+262", country: "Mayotte", flag: "YT", region: "África" },
    { code: "+52", country: "México", flag: "MX", region: "América del Norte" },
    { code: "+691", country: "Micronesia", flag: "FM", region: "Oceanía" },
    { code: "+373", country: "Moldavia", flag: "MD", region: "Europa" },
    { code: "+377", country: "Mónaco", flag: "MC", region: "Europa" },
    { code: "+976", country: "Mongolia", flag: "MN", region: "Asia" },
    { code: "+382", country: "Montenegro", flag: "ME", region: "Europa" },
    { code: "+1664", country: "Montserrat", flag: "MS", region: "Caribe" },
    { code: "+212", country: "Marruecos", flag: "MA", region: "África" },
    { code: "+258", country: "Mozambique", flag: "MZ", region: "África" },
    { code: "+264", country: "Namibia", flag: "NA", region: "África" },
    { code: "+674", country: "Nauru", flag: "NR", region: "Oceanía" },
    { code: "+977", country: "Nepal", flag: "NP", region: "Asia" },
    { code: "+31", country: "Países Bajos", flag: "NL", region: "Europa" },
    { code: "+64", country: "Nueva Zelanda", flag: "NZ", region: "Oceanía" },
    { code: "+505", country: "Nicaragua", flag: "NI", region: "América Central" },
    { code: "+227", country: "Níger", flag: "NE", region: "África" },
    { code: "+234", country: "Nigeria", flag: "NG", region: "África" },
    { code: "+683", country: "Niue", flag: "NU", region: "Oceanía" },
    { code: "+850", country: "Corea del Norte", flag: "KP", region: "Asia" },
    { code: "+82", country: "Corea del Sur", flag: "KR", region: "Asia" },
    { code: "+47", country: "Noruega", flag: "NO", region: "Europa" },
    { code: "+968", country: "Omán", flag: "OM", region: "Asia" },
    { code: "+92", country: "Pakistán", flag: "PK", region: "Asia" },
    { code: "+680", country: "Palaos", flag: "PW", region: "Oceanía" },
    { code: "+507", country: "Panamá", flag: "PA", region: "América Central" },
    { code: "+675", country: "Papúa Nueva Guinea", flag: "PG", region: "Oceanía" },
    { code: "+595", country: "Paraguay", flag: "PY", region: "Sudamérica" },
    { code: "+51", country: "Perú", flag: "PE", region: "Sudamérica" },
    { code: "+63", country: "Filipinas", flag: "PH", region: "Asia" },
    { code: "+48", country: "Polonia", flag: "PL", region: "Europa" },
    { code: "+351", country: "Portugal", flag: "PT", region: "Europa" },
    { code: "+1", country: "Puerto Rico", flag: "PR", region: "Caribe" },
    { code: "+974", country: "Catar", flag: "QA", region: "Asia" },
    { code: "+40", country: "Rumania", flag: "RO", region: "Europa" },
    { code: "+7", country: "Rusia", flag: "RU", region: "Asia" },
    { code: "+250", country: "Ruanda", flag: "RW", region: "África" },
    { code: "+590", country: "San Bartolomé", flag: "BL", region: "Caribe" },
    { code: "+685", country: "Samoa", flag: "WS", region: "Oceanía" },
    { code: "+378", country: "San Marino", flag: "SM", region: "Europa" },
    { code: "+239", country: "Santo Tomé y Príncipe", flag: "ST", region: "África" },
    { code: "+966", country: "Arabia Saudita", flag: "SA", region: "Asia" },
    { code: "+597", country: "Surinam", flag: "SR", region: "Sudamérica" },
    { code: "+47", country: "Suecia", flag: "SE", region: "Europa" },
    { code: "+41", country: "Suiza", flag: "CH", region: "Europa" },
    { code: "+255", country: "Tanzania", flag: "TZ", region: "África" },
    { code: "+66", country: "Tailandia", flag: "TH", region: "Asia" },
    { code: "+228", country: "Togo", flag: "TG", region: "África" },
    { code: "+676", country: "Tonga", flag: "TO", region: "Oceanía" },
    { code: "+1", country: "Trinidad y Tobago", flag: "TT", region: "Caribe" },
    { code: "+216", country: "Túnez", flag: "TN", region: "África" },
    { code: "+90", country: "Turquía", flag: "TR", region: "Asia" },
    { code: "+993", country: "Turkmenistán", flag: "TM", region: "Asia" },
    { code: "+1", country: "Islas Vírgenes de EE. UU.", flag: "VI", region: "Caribe" },
    { code: "+256", country: "Uganda", flag: "UG", region: "África" },
    { code: "+380", country: "Ucrania", flag: "UA", region: "Europa" },
    { code: "+971", country: "Emiratos Árabes Unidos", flag: "AE", region: "Asia" },
    { code: "+44", country: "Reino Unido", flag: "GB", region: "Europa" },
    { code: "+1", country: "Estados Unidos", flag: "US", region: "América del Norte" },
    { code: "+598", country: "Uruguay", flag: "UY", region: "Sudamérica" },
    { code: "+998", country: "Uzbekistán", flag: "UZ", region: "Asia" },
    { code: "+678", country: "Vanuatu", flag: "VU", region: "Oceanía" },
    { code: "+58", country: "Venezuela", flag: "VE", region: "Sudamérica" },
    { code: "+84", country: "Vietnam", flag: "VN", region: "Asia" },
    { code: "+681", country: "Wallis y Futuna", flag: "WF", region: "Oceanía" },
    { code: "+967", country: "Yemen", flag: "YE", region: "Asia" },
    { code: "+260", country: "Zambia", flag: "ZM", region: "África" },
    { code: "+263", country: "Zimbabue", flag: "ZW", region: "África" },
  ]; 


  useEffect(() => {
    const fetchUser = async () => {
      if (params.id) {
        const response = await axios.get(`/api/users/${params.id}`);
        setFormData(response.data);
      }
    };
    fetchUser();
  }, [params.id]);  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    await onSubmit(formData); // Llama a la función de envío
    router.push('/'); // Redirige a la página de inicio
  };

  // Manejo del cambio de país
  const handleCountryChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCountry = countryOptions.find(option => option.code === selectedCode);
    setSelectedCountry(selectedCountry);
    setFormData({ ...formData, countryCode: selectedCode });
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const selectedCountryCode = formData.countryCode;
    setFormData({ ...formData, phone: value });

    const expectedLength = phoneLengthsByCountry[selectedCountryCode] || 10;
    const isValidLength = value.replace(/\D/g, "").length === expectedLength;
    const phoneNumber = selectedCountryCode + value;
    const isValidNumber = isValidPhoneNumber(phoneNumber);

    setIsValidPhone(isValidNumber && isValidLength);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {mode === "user" && (
          <>
            {/* Role */}
            <label className="block text-black font-bold mb-2" htmlFor="role">Perfil</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            >
              <option value="">Seleccione</option>
              <option value="Administrador">Administrador</option>
              <option value="Cliente">Cliente</option>
            </select>

            {/* Email */}
            <label className="block text-black font-bold mb-2" htmlFor="email">
              Usuario
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
                setEmailTouched(true); // Marcar como tocado cuando el usuario cambia el valor
              }}
              placeholder="Correo Electrónico"
              className={`w-full p-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-4`}
              required
            />
            {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}

            {/* Password */}
            <label className="block text-black font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />
            {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}

            {/* Confirm Password */}
            <label className="block text-black font-bold mb-2" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme Contraseña"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />

            {/* First Name */}
            <label className="block text-black font-bold mb-2" htmlFor="firstname">
              Nombres
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />

            {/* Second Name */}
            <label className="block text-black font-bold mb-2" htmlFor="secondname">
              Apellidos
            </label>
            <input
              type="text"
              name="secondname"
              value={formData.secondname}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />

            {/* Document Type */}
            <label className="block text-black font-bold mb-2" htmlFor="doctype">
              Tipo de documento
            </label>
            <select
              name="doctype"
              value={formData.doctype}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            >
              <option value="">Seleccione</option>
              <option value="Cédula de ciudadanía (CC)">Cédula de ciudadanía - CC</option>
              <option value="Tarjeta de Identidad">Tarjeta de identidad - TI</option>
              <option value="Cédula de extranjería (CE)">Cédula de extranjería - CE</option>
              <option value="Pasaporte">Pasaporte - P</option>
              <option value="Permiso por Protección Temporal (PPT)">Permiso por Protección Temporal - PPT</option>
            </select>

            {/* Document Number */}
            <label className="block text-black font-bold mb-2" htmlFor="docnum">
              Número de documento
            </label>
            <input
              type="text"
              name="docnum"
              value={formData.docnum}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />

          <label className="block text-black font-bold mb-2" htmlFor="phone">
            Teléfono
          </label>

          <div className="flex items-center mb-4">
            {/* Bandera del país */}
              {selectedCountry && (
                <CountryFlag
                  countryCode={selectedCountry.flag}
                  svg
                  style={{ width: '2em', height: '2em', marginRight: '0.5rem' }} // Ajuste de estilo para la bandera
                  />
              )}

            {/* Country Code and Phone Number */}
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleCountryChange}
                className={`w-[full] p-3 border 'border-gray-300'} rounded-r-lg`}
                required
              >
                {countryOptions.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {country} ({code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`w-[full] p-3 border ${isValidPhone ? 'border-gray-300' : 'border-red-500'} rounded-r-lg`}
                required
              />

              {/* Mensaje de error */}
              {!isValidPhone && <p className="text-red-500 text-sm ml-2">Número de teléfono inválido</p>}
            </div>

            {/* Resto del formulario aquí... */}

            <button
              type="submit" // Tipo "submit" para el botón
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-orange-500 transition duration-300 mt-4"
            >
              Entrar
            </button>
            </>
        )}
    
        {mode === "login" && (
          <>
            {/* Email */}
            <label className="block text-black font-bold mb-2" htmlFor="email">
              Usuario
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo Electrónico"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />

            {/* Password */}
            <label className="block text-black font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su clave de acceso"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-orange-500 transition duration-300 mt-4"
            >
              Entrar
            </button>

            {/* Redirección a creación de cuenta */}
            <p className="mt-4">
              ¿Eres nuevo en Plato Justo?{" "}
            </p>
              <button
                onClick={() => window.location.href = "/users"}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-orange-500 transition duration-300 mt-4"
              >
                Crea tu cuenta de Plato Justo
              </button>

            {/* Botones de inicio de sesión con Google y Facebook */}
            <div className="flex justify-between space-x-4 mt-4">
              <LoginButtonGoogle />
              <LoginButtonFacebook />
            </div>
          </>
        )}


      </form>
    </div>
  );
}

export default UserForm;
