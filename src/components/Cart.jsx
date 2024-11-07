// Cart.jsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatQuantity = (fullCount, halfCount) => {
  let quantityDisplay = "";
  if (fullCount === 1) {
    quantityDisplay += "1 porción completa";
  } else if (fullCount > 1) {
    quantityDisplay += `${fullCount} porciones completas`;
  }
  if (halfCount === 1) {
    quantityDisplay += `${quantityDisplay ? " más " : ""}1 media porción`;
  } else if (halfCount > 1) {
    quantityDisplay += `${quantityDisplay ? " más " : ""}${halfCount} medias porciones`;
  }
  return quantityDisplay;
};

const Cart = ({
  cartItems = [],
  onRemoveFromCart = () => {},
  onUpdateQuantity = () => {},
  onClearCart = () => {}
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const totalFullCount = item.fullCount + Math.floor(item.halfCount / 2);
      const totalHalfCount = item.halfCount % 2;
      const totalFullPrice = item.fullPortionPrice * totalFullCount;
      const totalHalfPrice = item.halfPortionPrice * totalHalfCount;
      return total + totalFullPrice + totalHalfPrice;
    }, 0);
  };

  const handleUpdateQuantity = (id, type, count) => {
    if (count >= 0) {
      onUpdateQuantity(id, type, count);
    }
  };

  const obtenerProductosDelCarrito = () => {
    return cartItems.map(item => ({
      idProducto: item.id,
      nombre: item.name,
      porcion: item.halfCount > 0 ? "media" : "completa",
      cantidad: item.halfCount > 0 ? item.halfCount : item.fullCount,
      precio: item.halfCount > 0 ? item.halfPortionPrice : item.fullPortionPrice,
    }));
  };

  const realizarPedido = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "El carrito está vacío",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    toast({
      title: "Enviando pedido",
      description: "Enviando información a la cocina y a la base de datos SaborArte...",
    });

    try {
      const pedido = {
        productos: obtenerProductosDelCarrito(),
        fechaHora: new Date().toISOString(),
        estado: "pendiente",
        total: getTotalPrice(),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar el pedido");
      }

      toast({
        title: "Pedido enviado correctamente",
        description: `Número de pedido: ${data.orderId}. Guardado en la base de datos SaborArte.`,
      });

      try {
        onClearCart();
      } catch (error) {
        console.error("Error al limpiar el carrito:", error);
      }

      router.push('/kitchen-orders');
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Tu Carrito</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[50vh] lg:h-[60vh]">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Tu carrito está vacío</p>
          ) : (
            cartItems.map((item) => {
              const totalFullCount = item.fullCount + Math.floor(item.halfCount / 2);
              const remainingHalfCount = item.halfCount % 2;

              return (
                <div key={item.id} className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {totalFullCount > 0 && (
                      <p className="text-gray-600">
                        Porción completa: {formatPrice(item.fullPortionPrice)} por unidad
                      </p>
                    )}
                    {remainingHalfCount > 0 && (
                      <p className="text-gray-600">
                        Media porción: {formatPrice(item.halfPortionPrice)} por unidad
                      </p>
                    )}
                    <p className="text-gray-600">
                      {formatQuantity(totalFullCount, remainingHalfCount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <span>Porción Completa</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleUpdateQuantity(item.id, "full", item.fullCount - 1)}
                          variant="destructive"
                          size="sm"
                          disabled={item.fullCount <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.fullCount}</span>
                        <Button
                          onClick={() => handleUpdateQuantity(item.id, "full", item.fullCount + 1)}
                          variant="default"
                          size="sm"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Media Porción</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleUpdateQuantity(item.id, "half", item.halfCount - 1)}
                          variant="destructive"
                          size="sm"
                          disabled={item.halfCount <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.halfCount}</span>
                        <Button
                          onClick={() => handleUpdateQuantity(item.id, "half", item.halfCount + 1)}
                          variant="default"
                          size="sm"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => onRemoveFromCart(item.id)}
                      variant="outline"
                      size="sm"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch">
        <Separator className="my-4" />
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Total:</h3>
          <p className="text-xl font-bold">{formatPrice(getTotalPrice())}</p>
        </div>
        {isSubmitting ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ) : (
          <Button 
            className="w-full" 
            size="lg" 
            onClick={realizarPedido}
            disabled={isSubmitting || cartItems.length === 0}
          >
            {isSubmitting ? "Procesando..." : "Realizar Pedido"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Cart;