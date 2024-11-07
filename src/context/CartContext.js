"use client"; // Asegura que se ejecute en el cliente

import React, { createContext, useContext, useState } from "react";

// Crea el contexto
const CartContext = createContext();

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Estado para el carrito

  const addToCart = (product, portionType) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === product._id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...currentCart];
        const existingItem = updatedItems[existingItemIndex];

        if (portionType === "full") {
          existingItem.fullCount += 1;
        } else {
          existingItem.halfCount += 1;
          if (existingItem.halfCount % 2 === 0) {
            existingItem.fullCount += 1;
            existingItem.halfCount = 0;
          }
        }
        return updatedItems;
      } else {
        return [
          ...currentCart,
          {
            id: product._id,
            name: product.name,
            fullPortionPrice: product.fullPortionPrice,
            halfPortionPrice: product.halfPortionPrice,
            fullCount: portionType === "full" ? 1 : 0,
            halfCount: portionType === "half" ? 1 : 0,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (id, portion, newQuantity) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item };
          if (portion === "full") {
            updatedItem.fullCount = newQuantity;
          } else {
            updatedItem.halfCount = newQuantity;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const pricePerFullPortion = item.fullPortionPrice;
      const pricePerHalfPortion = item.halfPortionPrice;

      const totalFullCount = item.fullCount + Math.floor(item.halfCount / 2);
      const totalHalfCount = item.halfCount % 2;

      const totalFullPrice = pricePerFullPortion * totalFullCount;
      const totalHalfPrice = pricePerHalfPortion * totalHalfCount;

      return total + totalFullPrice + totalHalfPrice;
    }, 0);
  };

  // Nueva función para limpiar el carrito
  const clearCart = () => {
    setCart([]); // Vacia el carrito
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        handleUpdateQuantity,
        handleRemoveFromCart,
        getTotalPrice,
        clearCart, // Aquí agregamos la función
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  return useContext(CartContext);
};
