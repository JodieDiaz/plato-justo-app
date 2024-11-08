// lib/pedidoService.js insercion del nuevo pedido
import { connectDB } from "./mongodb";

export async function crearPedido(pedidoData) {
  const { db } = await connectDB();
  const collection = db.collection("pedidos");

  const nuevoPedido = {
    ...pedidoData,
    fecha: new Date(),
    estado: "pendiente",
    
  };

  const resultado = await collection.insertOne(nuevoPedido);
  return resultado.insertedId;
}
