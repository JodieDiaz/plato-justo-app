// app/kitchen-orders/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Función auxiliar para formatear fechas en formato de Colombia
const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/Bogota'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en formato de fecha';
  }
};

export default function KitchenOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
        }
        const data = await response.json();
        setPedidos(data.pedidos);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pedidos de Cocina</h1>
      <ScrollArea className="h-[70vh]">
        <div className="grid gap-4">
          {pedidos.map((pedido) => (
            <Card key={pedido._id}>
              <CardHeader>
                <CardTitle className="text-lg">Pedido #{pedido._id}</CardTitle>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Fecha de creación: {formatearFecha(pedido.fechaCreacion)}</p>
                  <p>Fecha y hora: {formatearFecha(pedido.fechaHora)}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">Estado: {pedido.estado}</p>
                  <div className="space-y-1">
                    <p className="font-semibold">Productos:</p>
                    {pedido.productos.map((producto, index) => (
                      <div key={index} className="ml-4">
                        <p>
                          {producto.nombre} - {producto.cantidad} {producto.porcion}
                          {producto.cantidad > 1 ? 'es' : ''} - 
                          {new Intl.NumberFormat('es-CO', { 
                            style: 'currency', 
                            currency: 'COP' 
                          }).format(producto.precio)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="font-bold mt-2">
                    Total: {new Intl.NumberFormat('es-CO', { 
                      style: 'currency', 
                      currency: 'COP' 
                    }).format(pedido.total)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}