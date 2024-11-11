//import { useParams } from "next/navigation";
//import { useRouter } from "next/router";  // Importa useRouter
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from "axios";
import CountryFlag from 'react-country-flag';
import { isValidPhoneNumber } from "libphonenumber-js";
import LoginButtonGoogle from '../components/LoginButtonGoogle';
import LoginButtonFacebook from '../components/LoginButtonFacebook';
import { signIn } from "next-auth/react";
import countryOptions from '../data/countryOptions';   // Importar countryOptions
import phoneLengthsByCountry from '../data/phoneLengthsByCountry';   // Importar phoneLengthsByCountry

function UserForm({ mode = "user", onSubmit = () => {} }) {
  const params = useParams();
  const router = useRouter();  // Crea una instancia de useRouter

  // Estado centralizado para los datos del formulario y errores
  const [formData, setFormData] = useState({
    role: "",
    firstname: "",
    secondname: "",
    doctype: "Cédula de ciudadanía (CC)", // Valor predeterminado
    docnum: "",
    countryCode: "+57",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+57",
    country: "Colombia",
    flag: "CO",
    region: "América",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    phone: "",
    domain: ""
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
        const response = await axios.post("/api/verify-email-domain", { email: formData.email });
        if (!response.data.valid) {
          setDomainError("El dominio del correo electrónico no existe.");
        } else {
          setDomainError("");
        }
      } catch (error) {
        console.error("Error al verificar el dominio:", error.message);
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


  // Validación de correo electrónico
  useEffect(() => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateDomain = async () => {
      try {
        const response = await axios.post("/api/verify-email-domain", { email: formData.email });
        if (!response.data.valid) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            domain: "El dominio del correo electrónico no existe."
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, domain: "" }));
        }
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          domain: "Error al verificar el dominio del correo electrónico."
        }));
      }
    };

    if (emailTouched) {
      if (!emailPattern.test(formData.email)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "El formato del correo electrónico no es válido."
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
        validateDomain();
      }
    }
  }, [formData.email, emailTouched]);

  // Validación de contraseña
  useEffect(() => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

    if (formData.password.length > 0) {
      if (!passwordPattern.test(formData.password)) {
        setPasswordError("La contraseña debe tener entre 6 y 12 caracteres, incluir al menos una mayúscula, un número y un carácter especial.");
      } else if (formData.password !== formData.confirmPassword) {
        setPasswordError("Las contraseñas no coinciden.");
      } else {
        setPasswordError("");
      }
    }
  }, [formData.password, formData.confirmPassword]);


  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const selectedCountryCode = formData.countryCode;
    setFormData({ ...formData, phone: value });

    const expectedLength = phoneLengthsByCountry[selectedCountryCode] || 10;
    const isValidLength = value.replace(/\D/g, "").length === expectedLength;
    const phoneNumber = selectedCountryCode + value;
    const isValidNumber = isValidPhoneNumber(phoneNumber);

    if (!isValidNumber || !isValidLength) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Número de teléfono inválido."
      }));
      setIsValidPhone(false);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
      setIsValidPhone(true);
    }
  };

  // Manejo del cambio de país
  const handleCountryChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCountry = countryOptions.find(option => option.code === selectedCode);
    setSelectedCountry(selectedCountry);
    setFormData({ ...formData, countryCode: selectedCode });
  };

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejo del envío del formulario
  const handleSubmit1 = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/users/create-user", formData);

      if (response.status === 201) {
        alert("Usuario creado exitosamente.");
        await onSubmit(formData);
        router.push('/');
      } else {
        alert("Error al crear usuario.");
      }
    } catch (error) {
      alert("Hubo un problema al registrar el usuario.");
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
  
    const result = await signIn("credentials", {
      redirect: false, // Mantenemos esto en false para manejar la redirección manualmente
      email: formData.email,
      password: formData.password,
      callbackUrl: "/menu",
    });
  
    // Verificamos si el inicio de sesión fue exitoso
    if (result?.error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        login: "Credenciales incorrectas, intenta de nuevo",
      }));
    } else if (result.ok) {
      // Redireccionamos manualmente a /menu si el inicio de sesión fue exitoso
      router.push(result.url || "/menu");
    }
  };
  

  return (
    <div>
      {/* Formulario de registro */}
      {mode === "user" && (
      <form onSubmit={handleSubmit1} className="max-w-md mx-auto space-y-4">
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
            Registrar
          </button>
          </>
      </form>
      )}

      {/* Formulario de inicio de sesión */}
      {mode === "login" && (
        <form onSubmit={handleSubmit2} className="max-w-md mx-auto space-y-4">

          {/* Campos de formulario de inicio de sesión */}

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

          {/* Mostrar mensaje de error si las credenciales son incorrectas */}
          {errors.login && (
            <p className="text-red-500 text-sm mb-4">{errors.login}</p>
          )}          

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-orange-500 transition duration-300 mt-4"
          >
            Entrar
          </button>
        </form>
      )}

      {/* Botones de inicio de sesión con Google y Facebook (solo se muestran cuando el modo es "login") */}
      {mode === "login" && (
        <div className="flex justify-center space-x-4 mt-4">
          <LoginButtonGoogle />
          <LoginButtonFacebook />
        </div>       
      )}

      {/* Redirección a la página de registro (solo se muestra cuando el modo es "login") */}
      {mode === "login" && (
        <div className="mt-4">
          <p>¿Eres nuevo en Plato Justo?{" "}</p>
        <button
          onClick={() => router.push("/users")}
          className="bg-black text-white px-8 py-3 rounded-full hover:bg-orange-500 transition duration-300 mt-4"
        >
          Crea tu cuenta de Plato Justo
        </button>
        </div>
      )}   
    </div>
  );
}

export default UserForm;
