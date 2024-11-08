'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell } from 'lucide-react';

const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  try {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Bogota'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en formato de fecha';
  }
};

const getBackgroundColor = (estado) => {
  switch (estado.toLowerCase()) {
    case 'pendiente': return 'bg-yellow-100';
    case 'entregado': return 'bg-green-100';
    default: return 'bg-white';
  }
};

export default function KitchenOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(null);
  const [nuevoPedido, setNuevoPedido] = useState(false);
  const { toast } = useToast();

  const fetchPedidos = useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Error al obtener los pedidos');
      const data = await response.json();
      if (data.pedidos.length > pedidos.length) {
        setNuevoPedido(true);
        setTimeout(() => setNuevoPedido(false), 5000); // La señal desaparece después de 5 segundos
      }
      setPedidos(data.pedidos);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [pedidos.length]);

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 30000);
    return () => clearInterval(interval);
  }, [fetchPedidos]);

  const marcarComoEntregado = async (pedidoId) => {
    setActualizando(pedidoId);
    try {
      const response = await fetch(`/api/orders/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'entregado',
          fechaEntrega: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar el pedido');
      }

      setPedidos(pedidos => pedidos.map(pedido => 
        pedido._id === pedidoId 
          ? { ...pedido, estado: 'entregado', fechaEntrega: new Date().toISOString() } 
          : pedido
      ));

      toast({
        title: "Pedido actualizado",
        description: "El pedido ha sido marcado como entregado",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo marcar el pedido como entregado",
      });
    } finally {
      setActualizando(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando pedidos...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pedidos de Cocina</h1>
        {nuevoPedido && (
          <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full animate-pulse">
            <Bell className="mr-2" />
            <span>¡Nuevo pedido entrante!</span>
          </div>
        )}
      </div>
      <ScrollArea className="h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pedidos.map((pedido) => (
            <Card 
              key={pedido._id} 
              className={`border-2 transition-colors duration-200 ${getBackgroundColor(pedido.estado)}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Pedido #{pedido._id}</p>
                    <CardTitle className="text-xl mt-1">
                      Cliente: {pedido.cliente?.nombre || 'No especificado'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Tel: {pedido.cliente?.telefono || 'No especificado'}
                    </p>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    pedido.estado === 'entregado' ? 'bg-green-600 text-white' : 'bg-black text-white'
                  }`}>
                    {pedido.estado}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Creado: {formatearFecha(pedido.fechaCreacion)}
                </p>
                {pedido.fechaEntrega && (
                  <p className="text-sm font-medium text-green-600 mt-1">
                    Entregado: {formatearFecha(pedido.fechaEntrega)}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold mb-4">Productos:</h3>
                <ul className="space-y-4">
                  {pedido.productos.map((producto, index) => (
                    <li key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-2xl font-bold">{producto.nombre}</span>
                          <span className="text-lg ml-4">
                            {producto.porcion}
                          </span>
                        </div>
                        <span className="text-3xl font-extrabold text-primary">
                          x{producto.cantidad}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => marcarComoEntregado(pedido._id)}
                  disabled={pedido.estado === 'entregado' || actualizando === pedido._id}
                  className="w-full"
                  variant={pedido.estado === 'entregado' ? "secondary" : "default"}
                >
                  {actualizando === pedido._id 
                    ? "Actualizando..." 
                    : pedido.estado === 'entregado' 
                      ? "Entregado" 
                      : "Marcar como Entregado"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
//hog