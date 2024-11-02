"use client"; // Esto marca el componente como cliente

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { formatPrice } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export default function Cart({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
}) {
  // Función para formatear la cantidad
  const formatQuantity = (fullCount, halfCount) => {
    let quantityDisplay = "";

    if (fullCount === 1) {
      quantityDisplay += "1 porción completa"; // Cambiado a "porción completa"
    } else if (fullCount > 1) {
      quantityDisplay += `${fullCount} porciones completas`; // Cambiado a "porciones completas"
    }

    if (halfCount === 1) {
      quantityDisplay += `${quantityDisplay ? " más " : ""}1 media porción`; // Cambiado a "más"
    } else if (halfCount > 1) {
      quantityDisplay += `${quantityDisplay ? " más " : ""}${halfCount} medias porciones`;
    }

    return quantityDisplay;
  };

  // Calcula el precio total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const pricePerFullPortion = item.fullPortionPrice; // Precio por porción completa
      const pricePerHalfPortion = item.halfPortionPrice; // Precio por media porción

      const totalFullCount = item.fullCount + Math.floor(item.halfCount / 2); // Total de porciones completas
      const totalHalfCount = item.halfCount % 2; // Total de medias porciones restantes

      const totalFullPrice = pricePerFullPortion * totalFullCount; // Total de porciones completas
      const totalHalfPrice = pricePerHalfPortion * totalHalfCount; // Total de medias porciones

      return total + totalFullPrice + totalHalfPrice; // Suma total
    }, 0);
  };

  const handleUpdateQuantity = (id, type, count) => {
    // Siempre permite que ambas cantidades (completa y media) lleguen a 0
    onUpdateQuantity(id, type, count);
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
              const totalFullCount =
                item.fullCount + Math.floor(item.halfCount / 2);
              const remainingHalfCount = item.halfCount % 2; // Restante en medias porciones

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-4 text-sm"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {totalFullCount > 0 && (
                      <p className="text-gray-600">
                        Porción completa:{" "}
                        {formatPrice(parseFloat(item.fullPortionPrice))} por
                        unidad
                      </p>
                    )}
                    {remainingHalfCount > 0 && (
                      <p className="text-gray-600">
                        Media porción:{" "}
                        {formatPrice(parseFloat(item.halfPortionPrice))} por
                        unidad
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
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              "full",
                              item.fullCount - 1
                            )
                          }
                          className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600 transition-colors text-sm"
                          disabled={item.fullCount <= 0} // Permitir llegar a 0
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              "full",
                              item.fullCount + 1
                            )
                          }
                          className="bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-600 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span>
                        {totalFullCount}{" "}
                        {totalFullCount === 1 ? "porción" : "porciones"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Media Porción</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const newHalfCount = item.halfCount - 1;
                            handleUpdateQuantity(item.id, "half", newHalfCount);
                          }}
                          className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600 transition-colors text-sm"
                          disabled={item.halfCount <= 0} // Permitir llegar a 0
                        >
                          -
                        </button>
                        <button
                          onClick={() => {
                            const newHalfCount = item.halfCount + 1;
                            handleUpdateQuantity(item.id, "half", newHalfCount);
                            // Convierte a una porción completa si el conteo de medias porciones es par
                            if (newHalfCount % 2 === 0) {
                              handleUpdateQuantity(
                                item.id,
                                "full",
                                totalFullCount + 1
                              );
                            }
                          }}
                          className="bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-600 transition-colors text-sm"
                          disabled={item.halfCount > 0} // Permitir sumar más
                        >
                          +
                        </button>
                      </div>
                      <span>
                        {item.halfCount}{" "}
                        {item.halfCount === 1
                          ? "media porción"
                          : "medias porciones"}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="bg-gray-300 text-black rounded p-1 hover:bg-gray-400"
                    >
                      Eliminar
                    </button>
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
        <Button className="w-full" size="lg">
          Realizar Pedido
        </Button>
      </CardFooter>
    </Card>
  );
}
