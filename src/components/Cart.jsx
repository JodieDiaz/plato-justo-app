// Cart.jsx
"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

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
    quantityDisplay += `${quantityDisplay ? " más " : ""} 1 media porción`;
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [qrCode, setQrCode] = useState(null);

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
    return cartItems.flatMap(item => {
      const productos = [];
      
      if (item.fullCount > 0) {
        productos.push({
          idProducto: item.id,
          nombre: item.name,
          porcion: "completa",
          cantidad: item.fullCount,
          precio: item.fullPortionPrice,
          talla: 1
        });
      }
      
      if (item.halfCount > 0) {
        productos.push({
          idProducto: item.id,
          nombre: item.name,
          porcion: "media",
          cantidad: item.halfCount,
          precio: item.halfPortionPrice,
          talla: 0.5
        });
      }
      
      return productos;
    });
  };

  const handleMercadoPago = async () => {
    toast({
      title: "Redirigiendo a MercadoPago",
      description: "Serás redirigido a la página de pago...",
    });
    // Aquí implementarías la integración con MercadoPago
  };

  const handleGenerateQR = async () => {
    try {
      // Aquí generarías el código QR con la información del pago
      setQrCode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="); // Reemplazar con la generación real del QR
      toast({
        title: "Código QR generado",
        description: "Escanea el código QR para realizar el pago",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el código QR",
        variant: "destructive",
      });
    }
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
    
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async (paymentMethod) => {
    setIsSubmitting(true);
    
    try {
      const pedido = {
        productos: obtenerProductosDelCarrito(),
        fechaHora: new Date().toISOString(),
        estado: "pendiente",
        total: getTotalPrice(),
        metodoPago: paymentMethod
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
        throw new Error(data.error || "Error al procesar el pedido");
      }
  
      toast({
        title: "Pedido enviado correctamente",
        description: `Número de pedido: ${data.pedidoId}. Guardado en la base de datos SaborArte.`,
      });
  
      onClearCart();
      
      if (paymentMethod === 'mercadopago') {
        await handleMercadoPago();
      } else if (paymentMethod === 'qr') {
        await handleGenerateQR();
      }
      
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      toast({
        title: "Error",
        description: error.message || "Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Pedido</DialogTitle>
            <DialogDescription>
              Selecciona tu método de pago preferido
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <h3 className="font-medium">Resumen del pedido:</h3>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">
                    {formatQuantity(item.fullCount, item.halfCount)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center font-medium">
              <span>Total:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>

          </div>

          <DialogFooter className="sm:justify-start flex-col gap-2">
            <Button
              className="w-full"
              onClick={() => handleConfirmOrder('mercadopago')}
              disabled={isSubmitting}
            >
              Ir a MercadoPago
            </Button>
            
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleConfirmOrder('qr')}
              disabled={isSubmitting}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Generar código QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {qrCode && (
        <Dialog open={!!qrCode} onOpenChange={() => setQrCode(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Código QR para pago</DialogTitle>
              <DialogDescription>
                Escanea este código QR con tu aplicación de pagos
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center p-4">
              <img src={qrCode} alt="Código QR para pago" className="w-64 h-64" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      fullCount: PropTypes.number.isRequired,
      halfCount: PropTypes.number.isRequired,
      fullPortionPrice: PropTypes.number.isRequired,
      halfPortionPrice: PropTypes.number.isRequired,
    })
  ),
  onRemoveFromCart: PropTypes.func,
  onUpdateQuantity: PropTypes.func,
  onClearCart: PropTypes.func,
};

export default Cart;
