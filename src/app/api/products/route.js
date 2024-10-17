import connectToDatabase from "@/libs/db";
import { NextResponse } from "next/server";

// Controlador para manejar la creación de un producto (POST)
export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json(); // Obtener los datos enviados desde el formulario

    const {
      name,
      description,
      price,
      portions,
      grams,
      pricePerPortion,
      image,
    } = body;

    // Inserción en la base de datos MongoDB
    const result = await db.collection("products").insertOne({
      name,
      description,
      price,
      portions,
      grams,
      pricePerPortion,
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

export async function GET(req, res) {
  try {
    const { db } = await connectToDatabase();

    // Obtener todos los productos de la colección 'products'
    const products = await db.collection("products").find({}).toArray();

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
