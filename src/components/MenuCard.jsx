"use client"; // Si este componente también usa useState o useEffect, asegúrate de marcarlo como cliente.

import React from "react";
import { Button } from "@/components/ui/button";

const MenuCard = ({ product, addToCart, cartItems }) => {
  // Verifica si el producto ya está en el carrito para las porciones
  const isFullPortionInCart = cartItems.some(
    (item) => item.id === product._id && item.portion === "full"
  );

  const isHalfPortionInCart = cartItems.some(
    (item) => item.id === product._id && item.portion === "half"
  );

  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center transition-all hover:bg-gray-300 shadow-md">
      <div className="relative w-full h-[80px] mx-auto mb-2">
        <img
          src={product.image}
          alt={product.name}
          style={{ objectFit: "contain" }}
          className="w-full h-full"
        />
      </div>
      <h4 className="font-semibold my-1 text-sm">{product.name}</h4>
      <p className="mb-1 text-gray-600 text-xs">{product.description}</p>
      <div className="mb-2">
        <p className="font-bold text-sm">
          Precio por porción completa: ${product.fullPortionPrice}
        </p>
        <p className="font-bold text-sm">
          Precio por media porción: ${product.halfPortionPrice}
        </p>
      </div>
      <div className="flex flex-col justify-center gap-1">
        <Button
          onClick={() => addToCart(product, "full")}
          className={`bg-black text-white rounded px-2 py-1 transition-colors hover:bg-orange-500 text-xs ${
            isFullPortionInCart ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isFullPortionInCart} // Deshabilita el botón si la porción completa ya está en el carrito
        >
          Porción Completa ({product.fullPortionGrams}g)
        </Button>
        <Button
          onClick={() => addToCart(product, "half")}
          className={`bg-black text-white rounded px-2 py-1 transition-colors hover:bg-orange-500 text-xs ${
            isHalfPortionInCart ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isHalfPortionInCart} // Deshabilita el botón si la media porción ya está en el carrito
        >
          Media Porción ({product.halfPortionGrams}g)
        </Button>
      </div>
    </div>
  );
};

export default MenuCard;
