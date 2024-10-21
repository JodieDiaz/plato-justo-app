"use client";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Cart({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
}) {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.portion === "full" ? item.fullPrice : item.halfPrice;
      return total + (price || 0) * item.quantity; // Asegúrate de manejar valores indefinidos
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
                    ${" "}
                    {(
                      (item.portion === "full"
                        ? item.fullPrice
                        : item.halfPrice) || 0
                    ).toFixed(2)}{" "}
                    por unidad
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.portion, item.quantity - 1)
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(
                        item.id,
                        item.portion,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-12 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.portion, item.quantity + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveFromCart(item.id, item.portion)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
          <p className="text-xl font-bold">${getTotalPrice().toFixed(2)}</p>
        </div>
        <Button className="w-full" size="lg">
          Realizar Pedido
        </Button>
      </CardFooter>
    </Card>
  );
}
