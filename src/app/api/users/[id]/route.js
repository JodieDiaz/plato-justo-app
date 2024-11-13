//import { connectToDatabase } from "@/libs/db"; // Asegúrate de que la ruta de esta importación sea correcta
import connectToDatabase from "../../../../libs/db_users";
import { ObjectId } from "mongodb"; // Asegúrate de tener mongodb instalado

// Obtener un usuario por ID
export async function GET(req, { params }) {
  const { id } = params; // Obtenemos el ID de los parámetros

  try {
    const { db } = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "usuario no encontrado" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener el usuario" }),
      { status: 500 }
    );
  }
}

// Actualizar un usuario por ID
export async function PUT(req, { params }) {
  const { id } = params; // Obtenemos el ID de los parámetros
  const body = await req.json(); // Obtener los datos del cuerpo de la solicitud

  try {
    const { db } = await connectToDatabase();

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: body } // Actualiza los campos según el cuerpo de la solicitud
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No se pudo actualizar el usuario" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "usuario actualizado exitosamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return new Response(
      JSON.stringify({ message: "Error al actualizar el usuario" }),
      { status: 500 }
    );
  }
}

// Eliminar un usuario por ID
export async function DELETE(req, { params }) {
  const { id } = params; // Obtenemos el ID de los parámetros

  try {
    const { db } = await connectToDatabase();
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No se pudo eliminar el usuario" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "usuario eliminado exitosamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return new Response(
      JSON.stringify({ message: "Error al eliminar el usuario" }),
      { status: 500 }
    );
  }
}
