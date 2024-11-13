import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Iniciando GET request para /api/orders');
    
    const { db } = await connectToDatabase();
    console.log('Conexión a la base de datos establecida');

    const pedidos = await db.collection('pedidos')
      .find({})
      .sort({ fechaCreacion: -1 })//ordenamos los resultados en la busqueda orden dewscendente
      .toArray();

    console.log(`Encontrados ${pedidos.length} pedidos`);
    
    return NextResponse.json({ pedidos });
  } catch (error) {
    console.error('Error en GET /api/orders:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pedidos', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const pedido = await request.json();
    console.log('Datos del pedido recibidos:', pedido);

    const { db } = await connectToDatabase();

    const nuevoPedido = {
      ...pedido,
      fechaCreacion: new Date(),
      estado: pedido.estado || 'pendiente'
    };

    const result = await db.collection('pedidos').insertOne(nuevoPedido);

    return NextResponse.json({
      message: 'Pedido creado correctamente',
      pedidoId: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return NextResponse.json(
      { error: 'Error al crear el pedido', details: error.message },
      { status: 500 }
    );
  }
}