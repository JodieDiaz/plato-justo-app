'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el pedido');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Pedido no encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El pedido con ID {orderId} no existe o ha sido eliminado.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Detalles del Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <div className="space-y-2">
              {order.productos.map((producto, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-2 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{producto.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      Porción: {producto.porcion}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>x{producto.cantidad}</p>
                    <p className="font-medium">${producto.precio.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Estado:</span>
              <span className="capitalize">{order.estado}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Fecha:</span>
              <span>{new Date(order.fechaHora).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
        <Button onClick={() => window.print()}>
          Imprimir Pedido
        </Button>
      </CardFooter>
    </Card>
  );
}