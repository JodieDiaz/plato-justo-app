import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // Nuevo Henry
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { estado, fechaEntrega } = await request.json();

    const { db } = await connectToDatabase();

    const result = await db.collection('pedidos').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          estado: estado,
          fechaEntrega: fechaEntrega
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pedido actualizado correctamente' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request, { params }) {

  try {
    const { id } = params;

    const { db } = await connectToDatabase();

    const pedido = await db.collection('pedidos').findOne({ _id: new ObjectId(id) });

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json(pedido);

  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
