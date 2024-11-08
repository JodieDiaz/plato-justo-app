// app/api/orders/route.js
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { db } = await connectDB();
    const pedido = await request.json();

    if (!pedido.productos || !Array.isArray(pedido.productos) || pedido.productos.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe contener productos' },
        { status: 400 }
      );
    }

    const now = new Date();
    const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
    
    const pedidoCompleto = {
      ...pedido,
      fechaHora: colombiaTime.toISOString(),
      fechaCreacion: colombiaTime,
      estado: 'pendiente',
    };

    const collection = db.collection('pedidos');
    const resultado = await collection.insertOne(pedidoCompleto);

    return NextResponse.json({
      success: true,
      message: 'Pedido creado exitosamente',
      orderId: resultado.insertedId,
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectDB();
    const collection = db.collection('pedidos');
    
    const pedidos = await collection
      .find({})
      .sort({ fechaCreacion: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      pedidos 
    });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pedidos' },
      { status: 500 }
    );
  }
}