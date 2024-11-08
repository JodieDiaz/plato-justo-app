// src/api/users/route.js
import connectToDatabase from "../../../libs/db_user";
import { NextResponse } from "next/server";

// Controlador para manejar la creación de un usuario (POST)
export async function POST(req) {
  try {
    const { db } = await connectToDatabase(); // Conexión a la base de datos
    const body = await req.json(); // Obtener los datos enviados desde el formulario

    // Desestructuración del cuerpo de la solicitud
    const {
      role,
      firstname,
      secondname,
      doctype,
      docnum,
      email,
      password,
      countryCode,
      phone,
    } = body;

    // Imprimir el cuerpo para depuración
    console.log("Cuerpo de la solicitud:", body);

    // Validación de datos
    const errors = [];
    const phonePattern = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/; // Formato: 123-456-7890 o 123 456 7890
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const docnumPattern = /^\d+$/; // Permite solo dígitos
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Ejemplo: al menos 8 caracteres, 1 letra y 1 número

    if (!role || typeof role !== "string" || role.trim() === "" ) {
      errors.push("El campo 'role' es requerido y debe ser un texto no vacio");
    }

    if (!firstname || typeof firstname !== "string" || firstname.trim() === "") {
      errors.push("El campo 'firstname' es requerido y debe ser un texto no vacío.");
    }

    if (!secondname || typeof secondname !== "string" || secondname.trim() === "") {
      errors.push("El campo 'secondname' es requerido y debe ser un texto no vacío.");
    }

    if (!doctype || typeof doctype !== "string" || doctype.trim() === "") {
      errors.push("El campo 'doctype' es requerido y debe ser un texto no vacío.");
    }

    // Validación de docnum: debe contener solo números y ser positivo
    if (!docnum || typeof docnum !== "string" || !docnumPattern.test(docnum)) {
      errors.push("El campo 'docnum' es requerido y debe contener solo números, sin puntos ni comas.");
    }

    if (!email || typeof email !== "string" || !emailPattern.test(email)) {
      errors.push("El correo electrónico debe ser válido y contener un '@' seguido de un dominio.");
    }

    if (!password || typeof password !== "string" || !passwordPattern.test(password)) {
      errors.push("La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número.");
    } 
   
    if (!phone || !phonePattern.test(phone)) {
      errors.push("El número de teléfono debe estar en el formato correcto (ejemplo: 123-456-7890 o 123 456 7890).");
    }

    // Si hay errores, devolverlos
    if (errors.length > 0) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    // Inserción en la base de datos MongoDB
    const result = await db.collection("users").insertOne({
      role,
      firstname,
      secondname,
      doctype,
      docnum,
      email,
      password,
      countryCode,
      phone,
      createdAt: new Date(),
    });

    // Devuelve la respuesta con el usuario creado
    return NextResponse.json({
      message: "Usuario creado exitosamente",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}

// Controlador para obtener todos los usuarios (GET)
export async function GET(req) {
  try {
    const { db } = await connectToDatabase(); // Conexión a la base de datos

    // Obtener todos los usuarios de la colección 'users'
    const users = await db.collection("users").find({}).toArray();
    console.log("Usuarios obtenidos:", users);

    // Devolver los usuarios con la información en formato JSON
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { message: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
