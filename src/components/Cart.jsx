"use client";

import React from "react"; // Importa React si aún no lo has hecho
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { formatPrice } from "@/lib/utils"; // Asegúrate de que esta ruta sea correcta
import { ScrollArea } from "./ui/scroll-area"; // Asegúrate de importar ScrollArea correctamente
import { Separator } from "./ui/separator"; // Asegúrate de importar Separator correctamente
import { Button } from "./ui/button"; // Asegúrate de importar Button correctamente

export default function Cart({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
}) {
  // Calcula el precio total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price =
        item.portion === "full" ? item.fullPortionPrice : item.halfPortionPrice;
      return total + (price || 0) * item.quantity;
    }, 0);
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
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.portion}`}
                className="flex items-center justify-between mb-4 text-sm"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">
                    {item.portion === "full"
                      ? "Porción completa"
                      : "Media porción"}
                  </p>
                  <p className="text-gray-600">
                    {formatPrice(
                      item.portion === "full"
                        ? parseFloat(item.fullPortionPrice)
                        : parseFloat(item.halfPortionPrice)
                    )}{" "}
                    por unidad
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        onUpdateQuantity(
                          item.id,
                          item.portion,
                          item.quantity - 1
                        );
                      }
                    }}
                    disabled={item.quantity <= 1}
                    className="bg-red-500 text-white rounded p-1 hover:bg-red-600"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, item.portion, item.quantity + 1)
                    }
                    className="bg-green-500 text-white rounded p-1 hover:bg-green-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemoveFromCart(item.id, item.portion)} // Pasa la 'portion' para la eliminación
                    className="bg-gray-300 text-black rounded p-1 hover:bg-gray-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch">
        <Separator className="my-4" />
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Total:</h3>
          <p className="text-xl font-bold">{formatPrice(getTotalPrice())}</p>
        </div>
        <Button className="w-full" size="lg">
          Realizar Pedido
        </Button>
      </CardFooter>
    </Card>
  );
}
