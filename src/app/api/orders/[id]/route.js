import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    console.log('Iniciando actualización de pedido:', params.id);
    
    // Validar el ID del pedido
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de pedido inválido' },
        { status: 400 }
      );
    }

    // Obtener los datos de actualización
    const actualizacion = await request.json();
    console.log('Datos de actualización:', actualizacion);

    // Conectar a la base de datos
    const { db } = await connectToDatabase();
    console.log('Conexión a base de datos establecida');

    // Realizar la actualización
    const resultado = await db.collection('pedidos').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          estado: actualizacion.estado,
          fechaEntrega: actualizacion.fechaEntrega || new Date().toISOString()
        } 
      }
    );

    console.log('Resultado de la actualización:', resultado);

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    if (resultado.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No se realizaron cambios en el pedido' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Pedido actualizado correctamente',
      resultado: resultado
    });

  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    return NextResponse.json(
      { 
        error: 'Error al actualizar el pedido',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de pedido inválido' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const pedido = await db.collection('pedidos').findOne({
      _id: new ObjectId(id)
    });

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    return NextResponse.json(
      { error: 'Error al obtener el pedido' },
      { status: 500 }
    );
  }
}