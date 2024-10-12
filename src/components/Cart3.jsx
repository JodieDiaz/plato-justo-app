"use client";
import { useState } from "react";
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const products = [
  {
    id: 1,
    name: "Pizza Margherita",
    description: "Tomate, mozzarella, albahaca",
    fullPrice: 10000,
    halfPrice: 6000,
    image: "/?height=100&width=100",
  },
  {
    id: 2,
    name: "Pasta Carbonara",
    description: "Espaguetis, huevo, panceta, queso",
    fullPrice: 12000,
    halfPrice: 7000,
    image: "/?height=100&width=100",
  },
  {
    id: 3,
    name: "Ensalada César",
    description: "Lechuga, pollo, crutones, aderezo César",
    fullPrice: 8000,
    halfPrice: 5000,
    image: "/?height=100&width=100",
  },
  {
    id: 4,
    name: "Tiramisú",
    description: "Postre italiano con café y mascarpone",
    fullPrice: 6000,
    halfPrice: 4000,
    image: "/?height=100&width=100",
  },
];

export default function RestaurantCart3() {
  const [cart, setCart] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState({});

  const addToCart = (product, portion) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id && item.portion === portion
      );
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id && item.portion === portion
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1, portion }];
    });
  };

  const removeFromCart = (productId, portion) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => !(item.id === productId && item.portion === portion)
      )
    );
  };

  const updateQuantity = (productId, portion, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, portion);
    } else {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === productId && item.portion === portion
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.portion === "full" ? item.fullPrice : item.halfPrice;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-2/3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-4 rounded-md"
                />
                <div className="flex justify-between mb-4 text-sm">
                  <p>Completa: ${product.fullPrice.toFixed(2)}</p>
                  <p>Media: ${product.halfPrice.toFixed(2)}</p>
                </div>
                <RadioGroup
                  onValueChange={(value) =>
                    setSelectedPortion({
                      ...selectedPortion,
                      [product.id]: value,
                    })
                  }
                  defaultValue="full"
                  className="flex justify-center gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id={`full-${product.id}`} />
                    <Label htmlFor={`full-${product.id}`} className="text-sm">
                      Completa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="half" id={`half-${product.id}`} />
                    <Label htmlFor={`half-${product.id}`} className="text-sm">
                      Media
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    addToCart(product, selectedPortion[product.id] || "full")
                  }
                  className="w-full text-sm"
                >
                  <Plus className="text-grey-600 mr-2 h-4 w-6" /> Agregar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Tu Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[50vh] lg:h-[60vh]">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500">
                  Tu carrito está vacío
                </p>
              ) : (
                cart.map((item) => (
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
                        $
                        {(item.portion === "full"
                          ? item.fullPrice
                          : item.halfPrice
                        ).toFixed(2)}{" "}
                        por unidad
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.portion,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
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
                          updateQuantity(
                            item.id,
                            item.portion,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(item.id, item.portion)}
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
              <ShoppingCart className="mr-2 h-5 w-5" /> Realizar Pedido
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
