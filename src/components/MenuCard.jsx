
"use client"; // Esto marca el componente como cliente

import React from "react";
import { Button } from "@/components/ui/button";

const MenuCard = ({ product, addToCart, cartItems }) => {

  // Verifica si el producto ya está en el carrito
  const isInCart = cartItems.some((item) => item.id === product._id);

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

          onClick={() => {
            if (!isInCart) {
              addToCart(product, "full");
            } else {
              alert("Debes aumentar las porciones desde el carrito");
            }
          }}
          className={`bg-black text-white rounded px-2 py-1 transition-colors hover:bg-orange-500 text-xs ${
            isInCart ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isInCart} // Deshabilita el botón si ya está en el carrito
        >
          Porción Completa ({product.fullPortionGrams}g)
        </Button>
        <Button

          onClick={() => {
            if (!isInCart) {
              addToCart(product, "half");
            } else {
              alert("Debes aumentar las porciones desde el carrito");
            }
          }}
          className={`bg-black text-white rounded px-2 py-1 transition-colors hover:bg-orange-500 text-xs ${
            isInCart ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isInCart} // Deshabilita el botón si ya está en el carrito
        >
          Media Porción ({product.halfPortionGrams}g)
        </Button>
      </div>
    </div>
  );
};

export default MenuCard;
