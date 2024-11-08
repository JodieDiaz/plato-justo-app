import connectToDatabase from "@/libs/db"; // Asegúrate de que esta ruta sea correcta
import { NextResponse } from "next/server";

// Controlador para manejar la creación de un producto (POST)
export async function POST(req) {
  try {
    const { db } = await connectToDatabase(); // Conexión a la base de datos
    const body = await req.json(); // Obtener los datos enviados desde el formulario


    // Desestructuración del cuerpo de la solicitud y conversión de tipos
    const {
      name,
      description,
      fullGrams,
      fullPortionGrams,
      halfPortionGrams,
      fullPortionPrice,
      halfPortionPrice,
      fullPrice,
      image,
    } = body;

    // Imprimir el cuerpo para depuración
    console.log("Cuerpo de la solicitud:", body);

    // Validación de datos
    const errors = [];

    if (!name || typeof name !== "string" || name.trim() === "") {
      errors.push("El campo 'name' es requerido y debe ser un texto no vacío.");
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      errors.push(
        "El campo 'description' es requerido y debe ser un texto no vacío."
      );
    }


    if (
      !fullGramsNum ||
      typeof fullGramsNum !== "number" ||
      fullGramsNum <= 0
    ) {
      errors.push(
        "El campo 'fullGrams' es requerido y debe ser un número mayor a 0."
      );
    }

    if (

      !fullPortionGramsNum ||
      typeof fullPortionGramsNum !== "number" ||
      fullPortionGramsNum <= 0
    ) {
      errors.push(
        "El campo 'fullPortionGrams' es requerido y debe ser un número mayor a 0."
      );
    }

    if (

      !halfPortionGramsNum ||
      typeof halfPortionGramsNum !== "number" ||
      halfPortionGramsNum <= 0
    ) {
      errors.push(
        "El campo 'halfPortionGrams' es requerido y debe ser un número mayor a 0."
      );
    }

    if (

      !fullPortionPriceNum ||
      typeof fullPortionPriceNum !== "number" ||
      fullPortionPriceNum < 0
    ) {
      errors.push(
        "El campo 'fullPortionPrice' es requerido y debe ser un número mayor o igual a 0."
      );
    }

    if (

      !halfPortionPriceNum ||
      typeof halfPortionPriceNum !== "number" ||
      halfPortionPriceNum < 0
    ) {
      errors.push(
        "El campo 'halfPortionPrice' es requerido y debe ser un número mayor o igual a 0."
      );
    }


    if (!fullPriceNum || typeof fullPriceNum !== "number" || fullPriceNum < 0) {
      errors.push(
        "El campo 'fullPrice' es requerido y debe ser un número mayor o igual a 0."
      );
    }

    if (!image || typeof image !== "string" || image.trim() === "") {
      errors.push("El campo 'image' es requerido y debe ser una URL no vacía.");
    }

    // Si hay errores, devolverlos
    if (errors.length > 0) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    // Inserción en la base de datos MongoDB
    const result = await db.collection("products").insertOne({
      name,
      description,

      fullGrams: fullGramsNum,
      fullPortionGrams: fullPortionGramsNum,
      halfPortionGrams: halfPortionGramsNum,
      fullPortionPrice: fullPortionPriceNum,
      halfPortionPrice: halfPortionPriceNum,
      fullPrice: fullPriceNum,
      image,
      createdAt: new Date(),
    });

    // Devuelve la respuesta con el producto creado
    return NextResponse.json({
      message: "Producto creado exitosamente",
      productId: result.insertedId,
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
    const { db } = await connectToDatabase(); // Conexión a la base de datos

    // Obtener todos los productos de la colección 'products'
    const products = await db.collection("products").find({}).toArray();
    console.log("Productos obtenidos:", products);


    // Función para formatear los números en formato colombiano
    const formatNumber = (number) => {
      return new Intl.NumberFormat("es-CO").format(number);
    };

    // Crear un arreglo para almacenar los productos con información adicional

    const productsWithAdditionalInfo = products.map((product) => {
      const totalPortions = Math.floor(
        product.fullGrams / product.fullPortionGrams
      );
      const remainingGrams = product.fullGrams % product.fullPortionGrams;


      // Agregar un nuevo campo "portions" en el objeto del producto
      return {
        ...product,
        portions: {
          completo: {
            grams: formatNumber(product.fullPortionGrams),
            price: formatNumber(product.fullPortionPrice),
            totalPortions,
            remainingGrams,
          },
          media: {
            grams: formatNumber(product.halfPortionGrams),
            price: formatNumber(product.halfPortionPrice),
          },
        },

      };
    });

    // Devolver los productos con la nueva información en formato JSON
    return NextResponse.json(productsWithAdditionalInfo, { status: 200 });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { message: "Error al obtener productos" },
      { status: 500 }
    );
  }

}

