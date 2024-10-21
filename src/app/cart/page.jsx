"use client";

import { useState, useEffect } from "react";
import Cart from "@/components/Cart";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Cargar el carrito del almacenamiento local
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const saveCartToLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    saveCartToLocalStorage(newCart);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
      <Cart cart={cart} setCart={updateCart} />
    </div>
  );
};

export default CartPage;
