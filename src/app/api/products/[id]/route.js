import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET para obtener un pedido específico
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectDB();
    
    const objectId = new ObjectId(id);
    const pedido = await db.collection("pedidos").findOne({ _id: objectId });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido no encontrado" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    return NextResponse.json(
      { error: "Error al obtener el pedido" }, 
      { status: 500 }
    );
  }
}

// PATCH para actualizar el estado de un pedido
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { estado } = await request.json();
    const { db } = await connectDB();
    
    const objectId = new ObjectId(id);
    
    const result = await db.collection("pedidos").findOneAndUpdate(
      { _id: objectId },
      { $set: { estado } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json(
        { error: "Pedido no encontrado" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    return NextResponse.json(
      { error: "Error al actualizar el pedido" }, 
      { status: 500 }
    );
  }
}