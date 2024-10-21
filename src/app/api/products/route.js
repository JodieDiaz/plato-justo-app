import connectToDatabase from "@/libs/db";
import { NextResponse } from "next/server";

// Controlador para manejar la creación de un producto (POST)
export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json(); // Obtener los datos enviados desde el formulario

    // Desestructuración del cuerpo de la solicitud
    const {
      name, // Nombre del producto
      description, // Descripción del producto
      fullGrams, // Gramos totales
      fullPortionGrams, // Gramos por porción completa
      halfPortionGrams, // Gramos por media porción
      fullPortionPrice, // Precio por porción completa
      halfPortionPrice, // Precio por media porción
      fullPrice, // Precio total del producto
      image, // URL de la imagen
    } = body;

    // Imprimir el cuerpo para depuración
    console.log("Cuerpo de la solicitud:", body);

    // Inserción en la base de datos MongoDB con el nuevo formato
    const result = await db.collection("products").insertOne({
      name,
      description,
      fullGrams, // Guardar como fullGrams
      fullPortionGrams, // Guardar como fullPortionGrams
      halfPortionGrams, // Guardar como halfPortionGrams
      fullPortionPrice, // Guardar como fullPortionPrice
      halfPortionPrice, // Guardar como halfPortionPrice
      fullPrice, // Guardar como fullPrice
      image,
      createdAt: new Date(),
    });

    // Devuelve la respuesta con el producto creado
    return NextResponse.json({
      message: "Producto creado exitosamente",
      productId: result.insertedId, // ID del nuevo producto creado
    });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}

// Controlador para obtener todos los productos (GET)
export async function GET(req) {
  try {
    const { db } = await connectToDatabase();

    // Obtener todos los productos de la colección 'products'
    const products = await db.collection("products").find({}).toArray();
    console.log("Productos obtenidos:", products);

    // Devolver los productos en formato JSON
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener productos" }),
      { status: 500 }
    );
  }
}
