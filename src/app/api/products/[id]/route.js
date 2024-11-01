import { connectToDatabase } from "@/libs/db"; // Asegúrate de que la ruta de esta importación sea correcta
import { ObjectId } from "mongodb"; // Asegúrate de tener mongodb instalado

// Obtener un producto por ID
export async function GET(req, { params }) {
  const { id } = params; // Obtenemos el ID de los parámetros

  try {
    const { db } = await connectToDatabase();
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Producto no encontrado" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener el producto" }),
      { status: 500 }
    );
  }
}

// Actualizar un producto por ID
export async function PUT(req, { params }) {
  const { id } = params; // Obtenemos el ID de los parámetros
  const body = await req.json(); // Obtener los datos del cuerpo de la solicitud

  try {
    const { db } = await connectToDatabase();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: body } // Actualiza los campos según el cuerpo de la solicitud
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No se pudo actualizar el producto" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Producto actualizado exitosamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return new Response(
      JSON.stringify({ message: "Error al actualizar el producto" }),
      { status: 500 }
    );
  }
}

// Eliminar un producto por ID
export async function DELETE(req, { params }) {
  const { id } = params; // Obtenemos el ID de los parámetros

  try {
    const { db } = await connectToDatabase();
    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No se pudo eliminar el producto" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Producto eliminado exitosamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return new Response(
      JSON.stringify({ message: "Error al eliminar el producto" }),
      { status: 500 }
    );
  }
}
